"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories() {
  try {
    const categories = await prisma.researchGuideCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { guides: true },
        },
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createCategory(data: { name: string; description?: string }) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    
    // Check if slug exists
    const existing = await prisma.researchGuideCategory.findUnique({
      where: { slug },
    });

    if (existing) {
      return { success: false, error: "Category with this name already exists" };
    }

    const category = await prisma.researchGuideCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
      },
    });

    revalidatePath("/dashboard/guides");
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.researchGuideCategory.delete({
      where: { id },
    });
    revalidatePath("/dashboard/guides");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// ==========================================
// GUIDES
// ==========================================

export async function getGuides() {
  try {
    const guides = await prisma.researchGuide.findMany({
      orderBy: { order: "asc" },
      include: {
        guideCategory: true,
      },
    });
    return { success: true, guides };
  } catch (error) {
    console.error("Error fetching guides:", error);
    return { success: false, error: "Failed to fetch guides" };
  }
}

export async function createGuide(data: { title: string; categoryId: string; fileUrl: string; description?: string }) {
  try {
    // Get max order to append to end
    const lastGuide = await prisma.researchGuide.findFirst({
      orderBy: { order: "desc" },
    });
    const order = (lastGuide?.order ?? 0) + 1;

    // Get category name for legacy compatibility
    const category = await prisma.researchGuideCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return { success: false, error: "Invalid category" };
    }

    const guide = await prisma.researchGuide.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        guideCategoryId: data.categoryId,
        category: category.slug, // Legacy field
        order,
      },
    });

    revalidatePath("/dashboard/guides");
    return { success: true, guide };
  } catch (error) {
    console.error("Error creating guide:", error);
    return { success: false, error: "Failed to create guide" };
  }
}

export async function updateGuideOrder(guides: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      guides.map((g) =>
        prisma.researchGuide.update({
          where: { id: g.id },
          data: { order: g.order },
        })
      )
    );
    revalidatePath("/dashboard/guides");
    return { success: true };
  } catch (error) {
    console.error("Error updating guide order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteGuide(id: string) {
  try {
    await prisma.researchGuide.delete({
      where: { id },
    });
    revalidatePath("/dashboard/guides");
    return { success: true };
  } catch (error) {
    console.error("Error deleting guide:", error);
    return { success: false, error: "Failed to delete guide" };
  }
}
