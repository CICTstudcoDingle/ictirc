"use server";

import { prisma, PaperStatus } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission, requireRole } from "@/lib/rbac";
import { sendStatusChangeEmail } from "@ictirc/email";

/**
 * Update paper status (review workflow)
 */
export async function updatePaperStatus(
  paperId: string,
  newStatus: PaperStatus
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check permission based on status transition
    if (newStatus === "PUBLISHED") {
      await requirePermission(user.id, "paper:publish");
    } else if (newStatus === "REJECTED") {
      await requirePermission(user.id, "paper:review");
    } else {
      await requirePermission(user.id, "paper:update");
    }

    // Get current paper state
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    // Validate status transition
    const validTransitions: Record<PaperStatus, PaperStatus[]> = {
      SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
      UNDER_REVIEW: ["ACCEPTED", "REJECTED", "SUBMITTED"],
      ACCEPTED: ["PUBLISHED", "UNDER_REVIEW"],
      PUBLISHED: [], // Can only be unpublished by Dean
      ARCHIVED: [], // Archived papers cannot have their status changed via this action
      REJECTED: ["SUBMITTED"], // Allow resubmission
    };

    if (!validTransitions[paper.status]?.includes(newStatus)) {
      // Dean can override any transition
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      if (dbUser?.role !== "DEAN") {
        return {
          success: false,
          error: `Invalid status transition: ${paper.status} → ${newStatus}`,
        };
      }
    }

    // Update paper status
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        status: newStatus,
        publishedAt: newStatus === "PUBLISHED" ? new Date() : paper.publishedAt,
      },
    });

    revalidatePath("/dashboard/papers");
    revalidatePath("/archive");

    // Send status change email to corresponding author — non-blocking
    const correspondingAuthor = paper.authors?.find((a) => a.isCorrespondingAuthor) ?? paper.authors?.[0];
    const STATUS_EMAIL_TRIGGERS: PaperStatus[] = ["UNDER_REVIEW", "ACCEPTED", "REJECTED", "PUBLISHED"];
    if (correspondingAuthor?.author?.email && STATUS_EMAIL_TRIGGERS.includes(newStatus)) {
      sendStatusChangeEmail({
        to: correspondingAuthor.author.email,
        paperTitle: paper.title,
        authorName: correspondingAuthor.author.name,
        submissionId: paper.id,
        newStatus: newStatus as "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "PUBLISHED",
        doi: updatedPaper.doi ?? undefined,
        notifyAdmin: true,
      }).catch((err) => {
        console.error("[updatePaperStatus] Failed to send status email:", err);
      });
    }

    return { success: true, paper: updatedPaper };
  } catch (error) {
    console.error("[updatePaperStatus] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

/**
 * Assign DOI to an accepted paper
 */
export async function assignDOI(paperId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "paper:publish");

    // Get paper
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    if (paper.doi) {
      return { success: false, error: "Paper already has a DOI assigned" };
    }

    if (paper.status !== "ACCEPTED" && paper.status !== "PUBLISHED") {
      return { success: false, error: "Paper must be accepted before DOI assignment" };
    }

    // Generate DOI using sequence
    const year = new Date().getFullYear();

    const sequence = await prisma.doiSequence.upsert({
      where: { year },
      update: { count: { increment: 1 } },
      create: { id: `doi_${year}`, year, count: 1 },
    });

    const paddedSerial = sequence.count.toString().padStart(5, "0");
    const doi = `10.ISUFST.CICT/${year}.${paddedSerial}`;

    // Update paper with DOI
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: { doi },
    });

    revalidatePath("/dashboard/papers");
    revalidatePath(`/archive/${paperId}`);

    return { success: true, paper: updatedPaper, doi };
  } catch (error) {
    console.error("[assignDOI] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign DOI",
    };
  }
}

/**
 * Revoke DOI from a paper (Dean only)
 */
export async function revokeDOI(paperId: string, reason: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Only Dean can revoke DOIs
    await requireRole(user.id, "DEAN");

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    if (!paper.doi) {
      return { success: false, error: "Paper does not have a DOI" };
    }

    // Store revoked DOI for audit (handled by audit agent)
    const revokedDoi = paper.doi;

    // Remove DOI and unpublish
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        doi: null,
        status: "REJECTED",
        publishedAt: null,
      },
    });

    revalidatePath("/dashboard/papers");
    revalidatePath("/archive");

    return {
      success: true,
      paper: updatedPaper,
      revokedDoi,
    };
  } catch (error) {
    console.error("[revokeDOI] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to revoke DOI",
    };
  }
}

/**
 * Delete a paper (Dean only)
 */
export async function deletePaper(paperId: string, reason: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Only Dean can hard delete papers
    await requireRole(user.id, "DEAN");

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: { authors: true },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    // Delete paper (cascades to PaperAuthor due to onDelete: Cascade)
    await prisma.paper.delete({
      where: { id: paperId },
    });

    revalidatePath("/dashboard/papers");
    revalidatePath("/archive");

    return { success: true };
  } catch (error) {
    console.error("[deletePaper] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete paper",
    };
  }
}

/**
 * Get papers with filtering and pagination
 */
export async function getPapers({
  status,
  categoryId,
  search,
  page = 1,
  limit = 20,
}: {
  status?: PaperStatus;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { abstract: { contains: search, mode: "insensitive" as const } },
          { keywords: { has: search } },
        ],
      }),
    };

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        include: {
          authors: {
            include: { author: true },
            orderBy: { order: "asc" },
          },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.paper.count({ where }),
    ]);

    return {
      success: true,
      papers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("[getPapers] Error:", error);
    return {
      success: false,
      papers: [],
      error: "Failed to fetch papers",
    };
  }
}

/**
 * Get single paper with full details
 */
export async function getPaper(paperId: string) {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    return { success: true, paper };
  } catch (error) {
    console.error("[getPaper] Error:", error);
    return {
      success: false,
      error: "Failed to fetch paper",
    };
  }
}
