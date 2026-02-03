"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@ictirc/database";
import {
  createArchivedPaperSchema,
  updateArchivedPaperSchema,
  type ArchivedPaperInput,
  type UpdateArchivedPaperInput,
  type CSVRowInput,
  csvRowSchema,
} from "../validations/archive";

// ============================================
// ARCHIVED PAPER MANAGEMENT
// ============================================

export async function createArchivedPaper(data: ArchivedPaperInput, uploaderId: string) {
  try {
    const validated = createArchivedPaperSchema.parse(data);

    const { authors, ...paperData } = validated;

    const paper = await prisma.archivedPaper.create({
      data: {
        ...paperData,
        publishedDate: new Date(validated.publishedDate),
        submittedDate: validated.submittedDate ? new Date(validated.submittedDate) : null,
        acceptedDate: validated.acceptedDate ? new Date(validated.acceptedDate) : null,
        uploadedBy: uploaderId,
        authors: {
          create: authors,
        },
      },
      include: {
        authors: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        issue: {
          include: {
            volume: true,
          },
        },
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: paper };
  } catch (error) {
    console.error("Error creating archived paper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create archived paper",
    };
  }
}

export async function updateArchivedPaper(id: string, data: UpdateArchivedPaperInput) {
  try {
    const validated = updateArchivedPaperSchema.parse(data);

    const { authors, ...paperData } = validated;

    const updateData: any = { ...paperData };
    if (validated.publishedDate) {
      updateData.publishedDate = new Date(validated.publishedDate);
    }
    if (validated.submittedDate) {
      updateData.submittedDate = new Date(validated.submittedDate);
    }
    if (validated.acceptedDate) {
      updateData.acceptedDate = new Date(validated.acceptedDate);
    }

    // If authors are being updated, delete old ones and create new ones
    if (authors) {
      await prisma.archivedPaperAuthor.deleteMany({
        where: { paperId: id },
      });

      updateData.authors = {
        create: authors,
      };
    }

    const paper = await prisma.archivedPaper.update({
      where: { id },
      data: updateData,
      include: {
        authors: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        issue: {
          include: {
            volume: true,
          },
        },
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: paper };
  } catch (error) {
    console.error("Error updating archived paper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update archived paper",
    };
  }
}

export async function deleteArchivedPaper(id: string) {
  try {
    await prisma.archivedPaper.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true };
  } catch (error) {
    console.error("Error deleting archived paper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete archived paper",
    };
  }
}

export async function getArchivedPaper(id: string) {
  try {
    const paper = await prisma.archivedPaper.findUnique({
      where: { id },
      include: {
        authors: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        issue: {
          include: {
            volume: true,
            conference: true,
          },
        },
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!paper) {
      return { success: false, error: "Archived paper not found" };
    }

    return { success: true, data: paper };
  } catch (error) {
    console.error("Error fetching archived paper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch archived paper",
    };
  }
}

export async function listArchivedPapers(issueId?: string) {
  try {
    const where = issueId ? { issueId } : {};

    const papers = await prisma.archivedPaper.findMany({
      where,
      include: {
        authors: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        issue: {
          include: {
            volume: true,
          },
        },
      },
      orderBy: [
        { issue: { publishedDate: "desc" } },
        { pageStart: "asc" },
        { createdAt: "asc" },
      ],
    });

    return { success: true, data: papers };
  } catch (error) {
    console.error("Error listing archived papers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list archived papers",
    };
  }
}

// ============================================
// BATCH UPLOAD
// ============================================

export async function batchCreateArchivedPapers(
  papers: ArchivedPaperInput[],
  uploaderId: string
) {
  try {
    const results = [];
    const errors = [];

    for (const paperData of papers) {
      const result = await createArchivedPaper(paperData, uploaderId);
      if (result.success) {
        results.push(result.data);
      } else {
        errors.push({
          title: paperData.title,
          error: result.error,
        });
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("Error batch creating archived papers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to batch create archived papers",
    };
  }
}

// ============================================
// CSV PARSING
// ============================================

export async function parseCSVRowToPaper(
  row: CSVRowInput,
  issueId: string,
  publishedDate: Date
): Promise<ArchivedPaperInput | null> {
  try {
    const validated = csvRowSchema.parse(row);

    // Find category by name
    const category = await prisma.category.findFirst({
      where: {
        name: {
          contains: validated.category,
          mode: "insensitive",
        },
      },
    });

    if (!category) {
      console.error(`Category not found: ${validated.category}`);
      return null;
    }

    // Parse keywords (semicolon-separated)
    const keywords = validated.keywords
      .split(";")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // Build authors array
    const authors = [];
    for (let i = 1; i <= 5; i++) {
      const nameKey = `author_${i}_name` as keyof CSVRowInput;
      const emailKey = `author_${i}_email` as keyof CSVRowInput;
      const affiliationKey = `author_${i}_affiliation` as keyof CSVRowInput;

      const name = validated[nameKey];
      if (name && typeof name === "string") {
        authors.push({
          name,
          email: validated[emailKey] as string | undefined,
          affiliation: validated[affiliationKey] as string | undefined,
          order: i - 1,
          isCorresponding: i === 1,
        });
      }
    }

    if (authors.length === 0) {
      console.error("No authors found in CSV row");
      return null;
    }

    const paper: ArchivedPaperInput = {
      title: validated.title,
      abstract: validated.abstract,
      keywords,
      categoryId: category.id,
      issueId,
      publishedDate,
      submittedDate: validated.submitted_date ? new Date(validated.submitted_date) : undefined,
      acceptedDate: validated.accepted_date ? new Date(validated.accepted_date) : undefined,
      pageStart: validated.page_start ? parseInt(validated.page_start) : undefined,
      pageEnd: validated.page_end ? parseInt(validated.page_end) : undefined,
      pdfUrl: validated.pdf_filename, // Will be replaced with actual URL after upload
      docxUrl: validated.docx_filename || undefined,
      authors,
    };

    return paper;
  } catch (error) {
    console.error("Error parsing CSV row:", error);
    return null;
  }
}
