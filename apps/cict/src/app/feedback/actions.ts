"use server";

import { prisma } from "@ictirc/database";
import { headers } from "next/headers";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  category: z.enum(["General", "Suggestion", "Bug Report", "Concern"]).default("General"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export type FeedbackActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitFeedbackAction(
  formData: FormData
): Promise<FeedbackActionResult> {
  const raw = {
    name: formData.get("name") as string | null,
    email: formData.get("email") as string | null,
    category: formData.get("category") as string,
    subject: formData.get("subject") as string | null,
    message: formData.get("message") as string,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
  };

  const result = feedbackSchema.safeParse({
    name: raw.name || undefined,
    email: raw.email || undefined,
    category: raw.category || "General",
    subject: raw.subject || undefined,
    message: raw.message,
    rating: raw.rating,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;

  try {
    await prisma.feedback.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        category: result.data.category,
        subject: result.data.subject,
        message: result.data.message,
        rating: result.data.rating,
        userAgent,
      },
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
