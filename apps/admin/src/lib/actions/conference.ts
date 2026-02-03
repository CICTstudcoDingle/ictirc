"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@ictirc/database";
import {
  conferenceSchema,
  updateConferenceSchema,
  type ConferenceInput,
  type UpdateConferenceInput,
} from "../validations/archive";

// ============================================
// CONFERENCE MANAGEMENT
// ============================================

export async function createConference(data: ConferenceInput) {
  try {
    const validated = conferenceSchema.parse(data);

    const conference = await prisma.conference.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : undefined,
      },
      include: {
        issues: {
          include: {
            volume: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/archives");
    revalidatePath("/dashboard/events");

    return { success: true, data: conference };
  } catch (error) {
    console.error("Error creating conference:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create conference",
    };
  }
}

export async function updateConference(id: string, data: UpdateConferenceInput) {
  try {
    const validated = updateConferenceSchema.parse(data);

    const updateData: any = { ...validated };
    if (validated.startDate) {
      updateData.startDate = new Date(validated.startDate);
    }
    if (validated.endDate) {
      updateData.endDate = new Date(validated.endDate);
    }

    const conference = await prisma.conference.update({
      where: { id },
      data: updateData,
      include: {
        issues: {
          include: {
            volume: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/archives");
    revalidatePath("/dashboard/events");

    return { success: true, data: conference };
  } catch (error) {
    console.error("Error updating conference:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update conference",
    };
  }
}

export async function deleteConference(id: string) {
  try {
    // Check if conference has issues
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        issues: true,
      },
    });

    if (!conference) {
      return { success: false, error: "Conference not found" };
    }

    if (conference.issues.length > 0) {
      return {
        success: false,
        error: `Cannot delete conference with ${conference.issues.length} linked issue(s). Unlink issues first.`,
      };
    }

    await prisma.conference.delete({
      where: { id },
    });

    revalidatePath("/dashboard/archives");
    revalidatePath("/dashboard/events");

    return { success: true };
  } catch (error) {
    console.error("Error deleting conference:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete conference",
    };
  }
}

export async function getConference(id: string) {
  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        issues: {
          include: {
            volume: true,
            _count: {
              select: {
                papers: true,
              },
            },
          },
          orderBy: {
            publishedDate: "desc",
          },
        },
      },
    });

    if (!conference) {
      return { success: false, error: "Conference not found" };
    }

    return { success: true, data: conference };
  } catch (error) {
    console.error("Error fetching conference:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch conference",
    };
  }
}

export async function listConferences() {
  try {
    const conferences = await prisma.conference.findMany({
      include: {
        issues: {
          include: {
            volume: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return { success: true, data: conferences };
  } catch (error) {
    console.error("Error listing conferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list conferences",
    };
  }
}

export async function listUpcomingConferences() {
  try {
    const now = new Date();
    const conferences = await prisma.conference.findMany({
      where: {
        startDate: {
          gte: now,
        },
        isPublished: true,
      },
      include: {
        issues: {
          include: {
            volume: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return { success: true, data: conferences };
  } catch (error) {
    console.error("Error listing upcoming conferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list upcoming conferences",
    };
  }
}

export async function listPastConferences() {
  try {
    const now = new Date();
    const conferences = await prisma.conference.findMany({
      where: {
        startDate: {
          lt: now,
        },
      },
      include: {
        issues: {
          include: {
            volume: true,
          },
        },
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return { success: true, data: conferences };
  } catch (error) {
    console.error("Error listing past conferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list past conferences",
    };
  }
}
