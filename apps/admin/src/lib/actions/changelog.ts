"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const releaseSchema = z.object({
  version: z.string().min(1, "Version is required"),
  versionType: z.enum(["MAJOR", "MINOR", "PATCH", "BETA", "ALPHA"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  releaseDate: z.string(), // ISO date string
  gitCommitHash: z.string().optional(),
  gitTag: z.string().optional(),
  isBeta: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

const changelogEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  changeType: z.enum([
    "FEATURE",
    "ENHANCEMENT",
    "BUGFIX",
    "SECURITY",
    "BREAKING",
    "DEPRECATED",
  ]),
  prNumber: z.number().optional(),
  prUrl: z.string().optional(),
  issueNumber: z.number().optional(),
  issueUrl: z.string().optional(),
  order: z.number().default(0),
});

export async function createRelease(formData: FormData, userId: string) {
  try {
    const data = {
      version: formData.get("version") as string,
      versionType: formData.get("versionType") as any,
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      releaseDate: formData.get("releaseDate") as string,
      gitCommitHash: formData.get("gitCommitHash") as string | undefined,
      gitTag: formData.get("gitTag") as string | undefined,
      isBeta: formData.get("isBeta") === "true",
      isPublished: formData.get("isPublished") === "true",
    };

    const validated = releaseSchema.parse(data);

    const release = await prisma.release.create({
      data: {
        ...validated,
        releaseDate: new Date(validated.releaseDate),
        createdBy: userId,
      },
    });

    revalidatePath("/dashboard/changelog");
    return { success: true, releaseId: release.id };
  } catch (error) {
    console.error("Failed to create release:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateRelease(
  releaseId: string,
  formData: FormData,
  userId: string
) {
  try {
    const data = {
      version: formData.get("version") as string,
      versionType: formData.get("versionType") as any,
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      releaseDate: formData.get("releaseDate") as string,
      gitCommitHash: formData.get("gitCommitHash") as string | undefined,
      gitTag: formData.get("gitTag") as string | undefined,
      isBeta: formData.get("isBeta") === "true",
      isPublished: formData.get("isPublished") === "true",
    };

    const validated = releaseSchema.parse(data);

    await prisma.release.update({
      where: { id: releaseId },
      data: {
        ...validated,
        releaseDate: new Date(validated.releaseDate),
      },
    });

    revalidatePath("/dashboard/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to update release:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteRelease(releaseId: string) {
  try {
    await prisma.release.delete({
      where: { id: releaseId },
    });

    revalidatePath("/dashboard/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete release:", error);
    return { success: false, error: String(error) };
  }
}

export async function addChangelogEntry(releaseId: string, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      changeType: formData.get("changeType") as any,
      prNumber: formData.get("prNumber")
        ? Number(formData.get("prNumber"))
        : undefined,
      prUrl: formData.get("prUrl") as string | undefined,
      issueNumber: formData.get("issueNumber")
        ? Number(formData.get("issueNumber"))
        : undefined,
      issueUrl: formData.get("issueUrl") as string | undefined,
      order: Number(formData.get("order") || 0),
    };

    const validated = changelogEntrySchema.parse(data);

    await prisma.changelogEntry.create({
      data: {
        ...validated,
        releaseId,
      },
    });

    revalidatePath("/dashboard/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to add changelog entry:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateChangelogEntry(entryId: string, formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      changeType: formData.get("changeType") as any,
      prNumber: formData.get("prNumber")
        ? Number(formData.get("prNumber"))
        : undefined,
      prUrl: formData.get("prUrl") as string | undefined,
      issueNumber: formData.get("issueNumber")
        ? Number(formData.get("issueNumber"))
        : undefined,
      issueUrl: formData.get("issueUrl") as string | undefined,
      order: Number(formData.get("order") || 0),
    };

    const validated = changelogEntrySchema.parse(data);

    await prisma.changelogEntry.update({
      where: { id: entryId },
      data: validated,
    });

    revalidatePath("/dashboard/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to update changelog entry:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteChangelogEntry(entryId: string) {
  try {
    await prisma.changelogEntry.delete({
      where: { id: entryId },
    });

    revalidatePath("/dashboard/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete changelog entry:", error);
    return { success: false, error: String(error) };
  }
}

export async function toggleReleasePublish(releaseId: string) {
  try {
    const release = await prisma.release.findUnique({
      where: { id: releaseId },
      select: { isPublished: true },
    });

    if (!release) {
      return { success: false, error: "Release not found" };
    }

    await prisma.release.update({
      where: { id: releaseId },
      data: { isPublished: !release.isPublished },
    });

    revalidatePath("/dashboard/changelog");
    revalidatePath("/changelog");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle release publish:", error);
    return { success: false, error: String(error) };
  }
}
