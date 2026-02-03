"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@ictirc/database";
import {
  volumeSchema,
  updateVolumeSchema,
  type VolumeInput,
  type UpdateVolumeInput,
} from "../validations/archive";

// ============================================
// VOLUME MANAGEMENT
// ============================================

export async function createVolume(data: VolumeInput) {
  try {
    const validated = volumeSchema.parse(data);

    // Check for duplicate
    const existing = await prisma.volume.findUnique({
      where: {
        volumeNumber_year: {
          volumeNumber: validated.volumeNumber,
          year: validated.year,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: `Volume ${validated.volumeNumber} for year ${validated.year} already exists`,
      };
    }

    const volume = await prisma.volume.create({
      data: validated,
      include: {
        issues: true,
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: volume };
  } catch (error) {
    console.error("Error creating volume:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create volume",
    };
  }
}

export async function updateVolume(id: string, data: UpdateVolumeInput) {
  try {
    const validated = updateVolumeSchema.parse(data);

    // If volumeNumber or year is being updated, check for duplicates
    if (validated.volumeNumber || validated.year) {
      const current = await prisma.volume.findUnique({
        where: { id },
      });

      if (!current) {
        return { success: false, error: "Volume not found" };
      }

      const volumeNumber = validated.volumeNumber ?? current.volumeNumber;
      const year = validated.year ?? current.year;

      const existing = await prisma.volume.findUnique({
        where: {
          volumeNumber_year: {
            volumeNumber,
            year,
          },
        },
      });

      if (existing && existing.id !== id) {
        return {
          success: false,
          error: `Volume ${volumeNumber} for year ${year} already exists`,
        };
      }
    }

    const volume = await prisma.volume.update({
      where: { id },
      data: validated,
      include: {
        issues: true,
      },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true, data: volume };
  } catch (error) {
    console.error("Error updating volume:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update volume",
    };
  }
}

export async function deleteVolume(id: string) {
  try {
    // Check if volume has issues
    const volume = await prisma.volume.findUnique({
      where: { id },
      include: {
        issues: true,
      },
    });

    if (!volume) {
      return { success: false, error: "Volume not found" };
    }

    if (volume.issues.length > 0) {
      return {
        success: false,
        error: `Cannot delete volume with ${volume.issues.length} issue(s). Delete issues first.`,
      };
    }

    await prisma.volume.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/archives");
    revalidatePath("/archive");

    return { success: true };
  } catch (error) {
    console.error("Error deleting volume:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete volume",
    };
  }
}

export async function getVolume(id: string) {
  try {
    const volume = await prisma.volume.findUnique({
      where: { id },
      include: {
        issues: {
          include: {
            conference: true,
            papers: {
              include: {
                category: true,
                authors: {
                  orderBy: {
                    order: "asc",
                  },
                },
              },
            },
          },
          orderBy: {
            issueNumber: "asc",
          },
        },
      },
    });

    if (!volume) {
      return { success: false, error: "Volume not found" };
    }

    return { success: true, data: volume };
  } catch (error) {
    console.error("Error fetching volume:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch volume",
    };
  }
}

export async function listVolumes() {
  try {
    const volumes = await prisma.volume.findMany({
      include: {
        issues: {
          include: {
            _count: {
              select: {
                papers: true,
              },
            },
          },
        },
      },
      orderBy: [
        { year: "desc" },
        { volumeNumber: "desc" },
      ],
    });

    return { success: true, data: volumes };
  } catch (error) {
    console.error("Error listing volumes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list volumes",
    };
  }
}
