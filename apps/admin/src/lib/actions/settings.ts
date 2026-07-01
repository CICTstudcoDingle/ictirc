"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { actionAuth } from "@/lib/auth";

// ============================================
// SETTINGS ACTIONS
// ============================================

export async function getSetting(key: string, defaultValue = "") {
  const auth = await actionAuth("system:settings");
  if (!auth.success)
    return { success: false, error: auth.error, value: defaultValue };

  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return { success: true, value: setting?.value ?? defaultValue };
  } catch (error) {
    console.error(`[getSetting] Error fetching ${key}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch setting",
      value: defaultValue,
    };
  }
}

export async function setSetting(key: string, value: string) {
  const auth = await actionAuth("system:settings");
  if (!auth.success) return { success: false, error: auth.error };

  try {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(`[setSetting] Error saving ${key}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save setting",
    };
  }
}

export interface GeneralSettings {
  repositoryName: string;
  repositoryDescription: string;
  issn: string;
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const keys = ["repository_name", "repository_description", "issn"];

  const defaults: Record<string, string> = {
    repository_name: "IRJICT - International Research Journal on ICT",
    repository_description:
      "The official research publication platform for the College of Information and Computing Technology at ISUFST.",
    issn: "2960-3773",
  };

  const auth = await actionAuth("system:settings");
  if (!auth.success) {
    return {
      repositoryName: defaults.repository_name,
      repositoryDescription: defaults.repository_description,
      issn: defaults.issn,
    };
  }

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: keys } },
    });

    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      repositoryName: map.get("repository_name") || defaults.repository_name,
      repositoryDescription:
        map.get("repository_description") || defaults.repository_description,
      issn: map.get("issn") || defaults.issn,
    };
  } catch (error) {
    console.error("[getGeneralSettings] Error:", error);
    return {
      repositoryName: defaults.repository_name,
      repositoryDescription: defaults.repository_description,
      issn: defaults.issn,
    };
  }
}

export async function updateGeneralSettings(data: GeneralSettings) {
  const auth = await actionAuth("system:settings");
  if (!auth.success) return { success: false, error: auth.error };

  try {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: "repository_name" },
        create: { key: "repository_name", value: data.repositoryName },
        update: { value: data.repositoryName },
      }),
      prisma.setting.upsert({
        where: { key: "repository_description" },
        create: {
          key: "repository_description",
          value: data.repositoryDescription,
        },
        update: { value: data.repositoryDescription },
      }),
      prisma.setting.upsert({
        where: { key: "issn" },
        create: { key: "issn", value: data.issn },
        update: { value: data.issn },
      }),
    ]);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("[updateGeneralSettings] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update general settings",
    };
  }
}

export interface EmailSettings {
  resendApiKey: string;
  fromEmail: string;
}

export async function getEmailSettings(): Promise<EmailSettings> {
  const auth = await actionAuth("system:settings");
  if (!auth.success) return { resendApiKey: "", fromEmail: "" };

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["resend_api_key", "from_email"] } },
    });

    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      resendApiKey: map.get("resend_api_key") || "",
      fromEmail: map.get("from_email") || "",
    };
  } catch (error) {
    console.error("[getEmailSettings] Error:", error);
    return { resendApiKey: "", fromEmail: "" };
  }
}

export async function updateEmailSettings(data: EmailSettings) {
  const auth = await actionAuth("system:settings");
  if (!auth.success) return { success: false, error: auth.error };

  try {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: "resend_api_key" },
        create: { key: "resend_api_key", value: data.resendApiKey },
        update: { value: data.resendApiKey },
      }),
      prisma.setting.upsert({
        where: { key: "from_email" },
        create: { key: "from_email", value: data.fromEmail },
        update: { value: data.fromEmail },
      }),
    ]);

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("[updateEmailSettings] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update email settings",
    };
  }
}
