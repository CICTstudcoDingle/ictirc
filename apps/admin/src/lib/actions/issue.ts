"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@ictirc/database";
import {
  issueSchema,
  updateIssueSchema,
  type IssueInput,
  type UpdateIssueInput,
} from "../validations/archive";

// ============================================
// ISSUE MANAGEMENT
// ============================================

export async function createIssue(data: IssueInput) {
  try {
    const validated = issueSchema.parse(data);

    // Check for duplicate
    const existing = await prisma.issue.findUnique({
      where: {
        volumeId_issueNumber: {
          volumeId: validated.volumeId,
          issueNumber: validated.issueNumber,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: `Issue ${validated.issueNumber} already exists for this volume`,
      };
    }

    const issue = await prisma.issue.create({
      data: {
        ...validated,
        publishedDate: new Date(validated.publishedDate),
      },
      include: {
        volume: true,
        conference: true,
        papers: true,
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: issue };
  } catch (error) {
    console.error("Error creating issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create issue",
    };
  }
}

export async function updateIssue(id: string, data: UpdateIssueInput) {
  try {
    const validated = updateIssueSchema.parse(data);

    // If issueNumber or volumeId is being updated, check for duplicates
    if (validated.issueNumber !== undefined || validated.volumeId) {
      const current = await prisma.issue.findUnique({
        where: { id },
      });

      if (!current) {
        return { success: false, error: "Issue not found" };
      }

      const issueNumber = validated.issueNumber ?? current.issueNumber;
      const volumeId = validated.volumeId ?? current.volumeId;

      const existing = await prisma.issue.findUnique({
        where: {
          volumeId_issueNumber: {
            volumeId,
            issueNumber,
          },
        },
      });

      if (existing && existing.id !== id) {
        return {
          success: false,
          error: `Issue ${issueNumber} already exists for this volume`,
        };
      }
    }

    const updateData: any = { ...validated };
    if (validated.publishedDate) {
      updateData.publishedDate = new Date(validated.publishedDate);
    }

    const issue = await prisma.issue.update({
      where: { id },
      data: updateData,
      include: {
        volume: true,
        conference: true,
        papers: true,
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: issue };
  } catch (error) {
    console.error("Error updating issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update issue",
    };
  }
}

export async function deleteIssue(id: string) {
  try {
    // Check if issue has papers
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        papers: true,
      },
    });

    if (!issue) {
      return { success: false, error: "Issue not found" };
    }

    if (issue.papers.length > 0) {
      return {
        success: false,
        error: `Cannot delete issue with ${issue.papers.length} paper(s). Delete papers first.`,
      };
    }

    await prisma.issue.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true };
  } catch (error) {
    console.error("Error deleting issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete issue",
    };
  }
}

export async function getIssue(id: string) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        volume: true,
        conference: true,
        papers: {
          include: {
            category: true,
            authors: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: [
            { pageStart: "asc" },
            { createdAt: "asc" },
          ],
        },
      },
    });

    if (!issue) {
      return { success: false, error: "Issue not found" };
    }

    return { success: true, data: issue };
  } catch (error) {
    console.error("Error fetching issue:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch issue",
    };
  }
}

export async function listIssues(volumeId?: string) {
  try {
    const where = volumeId ? { volumeId } : {};

    const issues = await prisma.issue.findMany({
      where,
      include: {
        volume: true,
        conference: true,
        _count: {
          select: {
            papers: true,
          },
        },
      },
      orderBy: [
        { publishedDate: "desc" },
        { issueNumber: "desc" },
      ],
    });

    return { success: true, data: issues };
  } catch (error) {
    console.error("Error listing issues:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list issues",
    };
  }
}
