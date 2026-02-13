"use server";

import { prisma } from "@ictirc/database";
import { Prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";

export async function getHomeContent() {
  const sections = await prisma.homeContent.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return sections;
}

export async function getHomeSection(section: string) {
  return prisma.homeContent.findUnique({
    where: { section },
  });
}

export async function upsertHomeSection(data: {
  section: string;
  title?: string;
  subtitle?: string;
  content?: Record<string, unknown>;
  imageUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}) {
  const existing = await prisma.homeContent.findUnique({
    where: { section: data.section },
  });

  if (existing) {
    await prisma.homeContent.update({
      where: { section: data.section },
      data: {
        title: data.title ?? existing.title,
        subtitle: data.subtitle ?? existing.subtitle,
        content: (data.content ?? existing.content) as Prisma.InputJsonValue,
        imageUrl: data.imageUrl ?? existing.imageUrl,
        isPublished: data.isPublished ?? existing.isPublished,
        displayOrder: data.displayOrder ?? existing.displayOrder,
      },
    });
  } else {
    await prisma.homeContent.create({
      data: {
        section: data.section,
        title: data.title,
        subtitle: data.subtitle,
        content: (data.content ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }

  revalidatePath("/dashboard/home-content");
  revalidatePath("/", "page");
  return { success: true };
}

export async function deleteHomeSection(section: string) {
  await prisma.homeContent.delete({
    where: { section },
  });
  revalidatePath("/dashboard/home-content");
  revalidatePath("/", "page");
  return { success: true };
}

export async function toggleHomeSectionPublished(section: string) {
  const existing = await prisma.homeContent.findUnique({
    where: { section },
  });
  if (!existing) return { success: false, error: "Section not found" };

  await prisma.homeContent.update({
    where: { section },
    data: { isPublished: !existing.isPublished },
  });
  revalidatePath("/dashboard/home-content");
  revalidatePath("/", "page");
  return { success: true };
}
