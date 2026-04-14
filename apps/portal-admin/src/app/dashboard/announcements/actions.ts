"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function ensureUniqueSlug(base: string): string {
  return `${base}-${Date.now()}`;
}

const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(120).optional(),
  content: z.string().min(10, "Content is required"),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isPinned: z.coerce.boolean().default(false),
});

export async function createAnnouncementAction(formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string | null,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string | null,
    coverImage: formData.get("coverImage") as string | null,
    status: formData.get("status") as string,
    isPinned: formData.get("isPinned") === "true",
  };

  const result = announcementSchema.safeParse({
    title: raw.title,
    slug: raw.slug || undefined,
    content: raw.content,
    excerpt: raw.excerpt || undefined,
    coverImage: raw.coverImage || undefined,
    status: raw.status || "DRAFT",
    isPinned: raw.isPinned,
  });

  if (!result.success) {
    // Server Actions used as form actions must return void — validation errors are surfaced via redirect with error state in production
    // For now, throw to surface issues clearly in development
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));
  }

  const baseSlug = result.data.slug || slugify(result.data.title);

  // Check for slug uniqueness — append timestamp if collision
  const existing = await prisma.portalAnnouncement.findUnique({
    where: { slug: baseSlug },
  });
  const finalSlug = existing ? ensureUniqueSlug(baseSlug) : baseSlug;

  await prisma.portalAnnouncement.create({
    data: {
      title: result.data.title,
      slug: finalSlug,
      content: result.data.content,
      excerpt: result.data.excerpt,
      coverImage: result.data.coverImage,
      status: result.data.status,
      isPinned: result.data.isPinned,
      publishedAt: result.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/announcements");
  redirect("/dashboard/announcements");
}

export async function updateAnnouncementAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string | null,
    coverImage: formData.get("coverImage") as string | null,
    status: formData.get("status") as string,
    isPinned: formData.get("isPinned") === "true",
  };

  const existing = await prisma.portalAnnouncement.findUnique({ where: { id } });
  if (!existing) return;

  const wasPublished = existing.status === "PUBLISHED";
  const nowPublished = raw.status === "PUBLISHED";

  await prisma.portalAnnouncement.update({
    where: { id },
    data: {
      title: raw.title,
      content: raw.content,
      excerpt: raw.excerpt || null,
      coverImage: raw.coverImage || null,
      status: raw.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      isPinned: raw.isPinned,
      publishedAt:
        !wasPublished && nowPublished ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/dashboard/announcements");
  redirect("/dashboard/announcements");
}

export async function publishAnnouncementAction(id: string) {
  await prisma.portalAnnouncement.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/dashboard/announcements");
}

export async function archiveAnnouncementAction(id: string) {
  await prisma.portalAnnouncement.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  revalidatePath("/dashboard/announcements");
}
