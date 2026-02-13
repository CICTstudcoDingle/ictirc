"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";

export async function getFeedback(options?: {
  page?: number;
  perPage?: number;
  category?: string;
  isRead?: boolean;
  isArchived?: boolean;
}) {
  const page = options?.page || 1;
  const perPage = options?.perPage || 20;
  const skip = (page - 1) * perPage;

  const where: Record<string, unknown> = {};
  if (options?.category) where.category = options.category;
  if (options?.isRead !== undefined) where.isRead = options.isRead;
  if (options?.isArchived !== undefined) where.isArchived = options.isArchived;

  const [feedback, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.feedback.count({ where }),
  ]);

  return {
    feedback,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function markFeedbackAsRead(id: string) {
  await prisma.feedback.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/feedback");
}

export async function markFeedbackAsUnread(id: string) {
  await prisma.feedback.update({
    where: { id },
    data: { isRead: false },
  });
  revalidatePath("/dashboard/feedback");
}

export async function archiveFeedback(id: string) {
  await prisma.feedback.update({
    where: { id },
    data: { isArchived: true },
  });
  revalidatePath("/dashboard/feedback");
}

export async function deleteFeedback(id: string) {
  await prisma.feedback.delete({
    where: { id },
  });
  revalidatePath("/dashboard/feedback");
}

export async function getFeedbackStats() {
  const [total, unread, byCategory] = await Promise.all([
    prisma.feedback.count({ where: { isArchived: false } }),
    prisma.feedback.count({ where: { isRead: false, isArchived: false } }),
    prisma.feedback.groupBy({
      by: ["category"],
      _count: { category: true },
      where: { isArchived: false },
    }),
  ]);

  return {
    total,
    unread,
    byCategory: byCategory.map((c) => ({
      category: c.category,
      count: c._count.category,
    })),
  };
}
