"use server";

import { prisma } from "@ictirc/database/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { uploadToHotStorage, generateFilePath } from "@ictirc/storage";
import { sendSubmissionConfirmation } from "@ictirc/email";

/**
 * Server-side validation schemas
 */
const authorSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  affiliation: z.string().min(2).max(200),
});

const submitPaperSchema = z.object({
  title: z.string().min(10).max(300),
  abstract: z.string().min(100), // Relaxed for server-side
  keywords: z.array(z.string()).min(3),
  categoryId: z.string().cuid(),
  authors: z.array(authorSchema).min(1).max(10),
});

export type SubmitPaperInput = z.infer<typeof submitPaperSchema>;

export interface SubmitPaperResult {
  success: boolean;
  paperId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Submit a new paper to the repository
 * 
 * Flow:
 * 1. Validate input data
 * 2. Upload file to Supabase Storage (hot storage)
 * 3. Create paper record with authors
 * 4. Send confirmation email (async)
 */
export async function submitPaper(
  formData: FormData
): Promise<SubmitPaperResult> {
  try {
    // Get authenticated user (optional for submission)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Extract and validate form data
    const rawData = {
      title: formData.get("title") as string,
      abstract: formData.get("abstract") as string,
      keywords: (formData.get("keywords") as string)
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      categoryId: formData.get("categoryId") as string,
      authors: JSON.parse(formData.get("authors") as string || "[]"),
    };

    const file = formData.get("file") as File | null;

    // Validate structured data
    const validationResult = submitPaperSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const data = validationResult.data;

    // Validate file
    if (!file || file.size === 0) {
      return {
        success: false,
        error: "Manuscript file is required",
      };
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Only PDF and DOCX files are accepted",
      };
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size must be less than 50MB",
      };
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return {
        success: false,
        error: "Invalid category selected",
      };
    }

    // Create paper in database first to get ID
    const paper = await prisma.paper.create({
      data: {
        title: data.title,
        abstract: data.abstract,
        keywords: data.keywords,
        categoryId: data.categoryId,
        status: "SUBMITTED",
      },
    });

    // Upload file to Supabase hot storage
    const filePath = generateFilePath(paper.id, file.name, "raw");
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await uploadToHotStorage(fileBuffer, filePath, {
      contentType: file.type,
      upsert: false,
    });

    if (!uploadResult.success) {
      // Rollback paper creation on upload failure
      await prisma.paper.delete({ where: { id: paper.id } });
      return {
        success: false,
        error: `File upload failed: ${uploadResult.error}`,
      };
    }

    // Update paper with file URL
    await prisma.paper.update({
      where: { id: paper.id },
      data: { rawFileUrl: uploadResult.url },
    });

    // Create or connect authors
    for (let i = 0; i < data.authors.length; i++) {
      const authorData = data.authors[i]!;

      // Upsert author (create if not exists)
      const author = await prisma.author.upsert({
        where: { email: authorData.email },
        update: {
          name: authorData.name,
          affiliation: authorData.affiliation,
        },
        create: {
          name: authorData.name,
          email: authorData.email,
          affiliation: authorData.affiliation,
        },
      });

      // Create paper-author relationship
      await prisma.paperAuthor.create({
        data: {
          paperId: paper.id,
          authorId: author.id,
          order: i,
        },
      });
    }

    // Revalidate paths
    revalidatePath("/archive");
    revalidatePath("/dashboard/papers");

    // Send confirmation email to the corresponding (first) author — non-blocking
    const correspondingAuthor = data.authors[0];
    if (correspondingAuthor) {
      sendSubmissionConfirmation({
        to: correspondingAuthor.email,
        paperTitle: data.title,
        authorName: correspondingAuthor.name,
        submissionId: paper.id,
        submittedAt: new Date(),
      }).catch((err) => {
        console.error("[submitPaper] Failed to send confirmation email:", err);
      });
    }

    return {
      success: true,
      paperId: paper.id,
    };
  } catch (error) {
    console.error("[submitPaper] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Get all categories for the submission form
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentId: true,
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("[getCategories] Error:", error);
    return { success: false, categories: [], error: "Failed to fetch categories" };
  }
}

/**
 * Get submission status by paper ID
 */
export async function getSubmissionStatus(paperId: string) {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: {
        id: true,
        title: true,
        status: true,
        doi: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    return { success: true, paper };
  } catch (error) {
    console.error("[getSubmissionStatus] Error:", error);
    return { success: false, error: "Failed to fetch submission status" };
  }
}
