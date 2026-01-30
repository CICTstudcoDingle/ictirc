"use server";

import { prisma, UserRole, InviteStatus } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission, requireRole, getRoleDisplayName } from "@/lib/rbac";
import { z } from "zod";

/**
 * Get all users with pagination
 */
export async function getUsers({
  role,
  search,
  page = 1,
  limit = 20,
}: {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "user:read");

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: [{ role: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("[getUsers] Error:", error);
    return {
      success: false,
      users: [],
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Only DEAN can change roles
    await requireRole(user.id, "DEAN");

    // Prevent self-demotion
    if (userId === user.id) {
      return { success: false, error: "Cannot change your own role" };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // Prevent demoting another DEAN (only one DEAN should exist)
    if (targetUser.role === "DEAN" && newRole !== "DEAN") {
      return { success: false, error: "Cannot demote the Dean" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/dashboard/users");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[updateUserRole] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

/**
 * Deactivate/Activate user account
 */
export async function toggleUserActive(userId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "user:update");

    // Prevent self-deactivation
    if (userId === user.id) {
      return { success: false, error: "Cannot deactivate your own account" };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // Prevent deactivating the Dean
    if (targetUser.role === "DEAN") {
      return { success: false, error: "Cannot deactivate the Dean account" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !targetUser.isActive },
    });

    revalidatePath("/dashboard/users");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[toggleUserActive] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user status",
    };
  }
}

/**
 * Create invite token for new user
 */
const inviteSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional().default("AUTHOR" as UserRole),
});

export async function createInvite(input: { email: string; role?: UserRole }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "user:invite");

    const validation = inviteSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: "Invalid input" };
    }

    const { email, role } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Check for existing pending invite
    const existingInvite = await prisma.inviteToken.findFirst({
      where: {
        email,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      return { success: false, error: "Pending invite already exists for this email" };
    }

    // Create invite token (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.inviteToken.create({
      data: {
        email,
        role,
        expiresAt,
        invitedById: user.id,
      },
    });

    // TODO: Send invite email via @ictirc/email package

    revalidatePath("/dashboard/users");

    return {
      success: true,
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        token: invite.token,
        expiresAt: invite.expiresAt,
      },
    };
  } catch (error) {
    console.error("[createInvite] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create invite",
    };
  }
}

/**
 * Accept invite and create user account
 * Called after Supabase auth signup with invite token
 */
export async function acceptInvite(token: string, supabaseUserId: string) {
  try {
    const invite = await prisma.inviteToken.findUnique({
      where: { token },
    });

    if (!invite) {
      return { success: false, error: "Invalid invite token" };
    }

    if (invite.status !== "PENDING") {
      return { success: false, error: "Invite has already been used" };
    }

    if (invite.expiresAt < new Date()) {
      await prisma.inviteToken.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return { success: false, error: "Invite has expired" };
    }

    // Create user with invited role
    const newUser = await prisma.user.create({
      data: {
        id: supabaseUserId,
        email: invite.email,
        role: invite.role,
        isActive: true,
      },
    });

    // Mark invite as accepted
    await prisma.inviteToken.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("[acceptInvite] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to accept invite",
    };
  }
}

/**
 * Get pending invites
 */
export async function getPendingInvites() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "user:read");

    const invites = await prisma.inviteToken.findMany({
      where: {
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, invites };
  } catch (error) {
    console.error("[getPendingInvites] Error:", error);
    return {
      success: false,
      invites: [],
      error: "Failed to fetch invites",
    };
  }
}

/**
 * Cancel/Delete an invite
 */
export async function cancelInvite(inviteId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requirePermission(user.id, "user:invite");

    await prisma.inviteToken.delete({
      where: { id: inviteId },
    });

    revalidatePath("/dashboard/users");

    return { success: true };
  } catch (error) {
    console.error("[cancelInvite] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel invite",
    };
  }
}
