"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { actionAuth } from "@/lib/auth";

export async function getFeedback(options?: {
  page?: number;
  perPage?: number;
  category?: string;
  isRead?: boolean;
  isArchived?: boolean;
}) {
  const auth = await actionAuth("feedback:manage");
  if (!auth.success)
    return {
      feedback: [],
      total: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
      error: auth.error,
    };

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
  const auth = await actionAuth("feedback:manage");
  if (!auth.success) throw new Error(auth.error);

  await prisma.feedback.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/feedback");
}

export async function markFeedbackAsUnread(id: string) {
  const auth = await actionAuth("feedback:manage");
  if (!auth.success) throw new Error(auth.error);

  await prisma.feedback.update({
    where: { id },
    data: { isRead: false },
  });
  revalidatePath("/dashboard/feedback");
}

export async function archiveFeedback(id: string) {
  const auth = await actionAuth("feedback:manage");
  if (!auth.success) throw new Error(auth.error);

  await prisma.feedback.update({
    where: { id },
    data: { isArchived: true },
  });
  revalidatePath("/dashboard/feedback");
}

export async function deleteFeedback(id: string) {
  const auth = await actionAuth("feedback:manage");
  if (!auth.success) throw new Error(auth.error);

  await prisma.feedback.delete({
    where: { id },
  });
  revalidatePath("/dashboard/feedback");
}

export async function getFeedbackStats() {
  const auth = await actionAuth("feedback:manage");
  if (!auth.success)
    return { total: 0, unread: 0, byCategory: [], error: auth.error };

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
