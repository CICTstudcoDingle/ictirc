"use server";

import { prisma } from "@ictirc/database";

// ============================================
// CATEGORY MANAGEMENT
// ============================================

export async function listCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            papers: true,
            archivedPapers: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error listing categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list categories",
      data: [],
    };
  }
}

export async function getCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        papers: {
          include: {
            authors: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
        archivedPapers: {
          include: {
            authors: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch category",
    };
  }
}
