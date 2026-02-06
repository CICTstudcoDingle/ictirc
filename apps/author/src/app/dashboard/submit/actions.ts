"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadToHotStorage, generateFilePath } from "@ictirc/storage";
import { z } from "zod";

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
  abstract: z.string().min(100),
  keywords: z.array(z.string()).min(3),
  categoryId: z.string().cuid(),
  authors: z.array(authorSchema).min(1).max(10),
});

export interface SubmitPaperResult {
  success: boolean;
  paperId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Submit a new paper from the Author Dashboard
 * This action is called by authenticated users only
 */
export async function submitPaperAction(
  formData: FormData
): Promise<SubmitPaperResult> {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to submit a paper",
      };
    }

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
      "application/msword",
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

    // Create or connect authors with corresponding author tracking
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
      // First author (index 0) is the corresponding author
      await prisma.paperAuthor.create({
        data: {
          paperId: paper.id,
          authorId: author.id,
          order: i,
          isCorrespondingAuthor: i === 0,
        },
      });
    }

    // Revalidate paths
    revalidatePath("/archive");
    revalidatePath("/dashboard/papers");
    revalidatePath("/dashboard");

    return {
      success: true,
      paperId: paper.id,
    };
  } catch (error) {
    console.error("[submitPaperAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
