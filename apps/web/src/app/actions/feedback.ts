"use server";

import { prisma } from "@ictirc/database";
import { headers } from "next/headers";

interface FeedbackInput {
  name?: string;
  email?: string;
  subject?: string;
  category: string;
  message: string;
  rating?: number;
}

export async function submitFeedback(data: FeedbackInput) {
  try {
    // Basic validation
    if (!data.message || data.message.trim().length < 10) {
      return { success: false, error: "Message must be at least 10 characters" };
    }

    if (data.message.length > 5000) {
      return { success: false, error: "Message must be under 5000 characters" };
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: "Invalid email address" };
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    const validCategories = ["General", "Bug Report", "Feature Request", "Content", "Other"];
    if (!validCategories.includes(data.category)) {
      return { success: false, error: "Invalid category" };
    }

    // Get user agent from headers
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;

    await prisma.feedback.create({
      data: {
        name: data.name?.trim() || null,
        email: data.email?.trim() || null,
        subject: data.subject?.trim() || null,
        category: data.category,
        message: data.message.trim(),
        rating: data.rating || null,
        userAgent,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }
}
