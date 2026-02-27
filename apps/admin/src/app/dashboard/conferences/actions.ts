"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/rbac";

// ============================================
// CONFERENCE ACTIONS (DEAN ONLY)
// ============================================

/**
 * Get all conferences
 */
export async function getConferences() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const conferences = await prisma.conference.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: { committee: true, issues: true, speakers: true },
        },
      },
    });

    return { success: true, conferences };
  } catch (error) {
    console.error("[getConferences] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch conferences",
    };
  }
}

/**
 * Get single conference with committee and speakers
 */
export async function getConference(id: string) {
  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        committee: {
          orderBy: { displayOrder: "asc" },
        },
        speakers: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!conference) {
      return { success: false, error: "Conference not found" };
    }

    return { success: true, conference };
  } catch (error) {
    console.error("[getConference] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch conference",
    };
  }
}

/**
 * Create new conference
 */
export async function createConference(data: {
  name: string;
  fullName?: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  venue?: string;
  theme?: string;
  organizers?: string[];
  partners?: string[];
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const conference = await prisma.conference.create({
      data: {
        ...data,
        organizers: data.organizers || [],
        partners: data.partners || [],
      },
    });

    revalidatePath("/dashboard/conferences");

    return { success: true, conference };
  } catch (error) {
    console.error("[createConference] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create conference",
    };
  }
}

/**
 * Update conference
 */
export async function updateConference(
  id: string,
  data: {
    name?: string;
    fullName?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    venue?: string;
    theme?: string;
    organizers?: string[];
    partners?: string[];
    logoUrl?: string;
    imageUrl?: string;
    websiteUrl?: string;
    isPublished?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const conference = await prisma.conference.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/conferences");
    revalidatePath(`/dashboard/conferences/${id}`);

    return { success: true, conference };
  } catch (error) {
    console.error("[updateConference] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update conference",
    };
  }
}

/**
 * Delete conference
 */
export async function deleteConference(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    await prisma.conference.delete({
      where: { id },
    });

    revalidatePath("/dashboard/conferences");

    return { success: true };
  } catch (error) {
    console.error("[deleteConference] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete conference",
    };
  }
}

/**
 * Set conference as active (deactivates all others)
 */
export async function setActiveConference(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    // Deactivate all conferences, then activate the selected one
    await prisma.$transaction([
      prisma.conference.updateMany({
        data: { isActive: false },
      }),
      prisma.conference.update({
        where: { id },
        data: { isActive: true },
      }),
    ]);

    revalidatePath("/dashboard/conferences");
    revalidatePath("/"); // Refresh landing page

    return { success: true };
  } catch (error) {
    console.error("[setActiveConference] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set active conference",
    };
  }
}

// ============================================
// COMMITTEE MEMBER ACTIONS (DEAN ONLY)
// ============================================

/**
 * Add committee member
 */
export async function addCommitteeMember(data: {
  conferenceId: string;
  name: string;
  position: string;
  affiliation?: string;
  email?: string;
  photoUrl?: string;
  displayOrder?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const member = await prisma.committeeMember.create({
      data,
    });

    revalidatePath(`/dashboard/conferences/${data.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${data.conferenceId}/committee`);

    return { success: true, member };
  } catch (error) {
    console.error("[addCommitteeMember] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add committee member",
    };
  }
}

/**
 * Update committee member
 */
export async function updateCommitteeMember(
  id: string,
  data: {
    name?: string;
    position?: string;
    affiliation?: string;
    email?: string;
    photoUrl?: string;
    displayOrder?: number;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const member = await prisma.committeeMember.update({
      where: { id },
      data,
    });

    revalidatePath(`/dashboard/conferences/${member.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${member.conferenceId}/committee`);

    return { success: true, member };
  } catch (error) {
    console.error("[updateCommitteeMember] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update committee member",
    };
  }
}

/**
 * Delete committee member
 */
export async function deleteCommitteeMember(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const member = await prisma.committeeMember.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/conferences/${member.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${member.conferenceId}/committee`);

    return { success: true };
  } catch (error) {
    console.error("[deleteCommitteeMember] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete committee member",
    };
  }
}

/**
 * Reorder committee members
 */
export async function reorderCommitteeMembers(
  conferenceId: string,
  orderedIds: string[]
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    // Update each member's display order
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.committeeMember.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    revalidatePath(`/dashboard/conferences/${conferenceId}`);
    revalidatePath(`/dashboard/conferences/${conferenceId}/committee`);

    return { success: true };
  } catch (error) {
    console.error("[reorderCommitteeMembers] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder committee members",
    };
  }
}

// ============================================
// KEYNOTE SPEAKER ACTIONS (DEAN ONLY)
// ============================================

/**
 * Add keynote speaker
 */
export async function addKeynoteSpeaker(data: {
  conferenceId: string;
  name: string;
  position: string;
  title?: string;
  affiliation?: string;
  location?: string;
  bio?: string;
  photoUrl?: string;
  displayOrder?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const speaker = await prisma.keynoteSpeaker.create({
      data,
    });

    revalidatePath(`/dashboard/conferences/${data.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${data.conferenceId}/speakers`);
    revalidatePath("/");

    return { success: true, speaker };
  } catch (error) {
    console.error("[addKeynoteSpeaker] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add keynote speaker",
    };
  }
}

/**
 * Update keynote speaker
 */
export async function updateKeynoteSpeaker(
  id: string,
  data: {
    name?: string;
    position?: string;
    title?: string;
    affiliation?: string;
    location?: string;
    bio?: string;
    photoUrl?: string;
    displayOrder?: number;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const speaker = await prisma.keynoteSpeaker.update({
      where: { id },
      data,
    });

    revalidatePath(`/dashboard/conferences/${speaker.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${speaker.conferenceId}/speakers`);
    revalidatePath("/");

    return { success: true, speaker };
  } catch (error) {
    console.error("[updateKeynoteSpeaker] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update keynote speaker",
    };
  }
}

/**
 * Delete keynote speaker
 */
export async function deleteKeynoteSpeaker(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const speaker = await prisma.keynoteSpeaker.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/conferences/${speaker.conferenceId}`);
    revalidatePath(`/dashboard/conferences/${speaker.conferenceId}/speakers`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("[deleteKeynoteSpeaker] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete keynote speaker",
    };
  }
}

/**
 * Update speaker photo URL
 */
export async function updateSpeakerPhoto(speakerId: string, photoUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const speaker = await prisma.keynoteSpeaker.update({
      where: { id: speakerId },
      data: { photoUrl },
    });

    revalidatePath(`/dashboard/conferences/${speaker.conferenceId}/speakers`);
    revalidatePath("/");

    return { success: true, speaker };
  } catch (error) {
    console.error("[updateSpeakerPhoto] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update speaker photo",
    };
  }
}
