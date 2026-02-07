"use server";

import { prisma } from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/rbac";

// ============================================
// ROLE ACTIONS (DEAN ONLY)
// ============================================

/**
 * Get all roles
 */
export async function getRoles() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return { success: true, roles };
  } catch (error) {
    console.error("[getRoles] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch roles",
    };
  }
}

/**
 * Create new role
 */
export async function createRole(data: {
  name: string;
  displayName: string;
  description?: string;
  permissions?: string[];
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    // Check for duplicate role name
    const existing = await prisma.role.findUnique({
      where: { name: data.name.toUpperCase() },
    });

    if (existing) {
      return { success: false, error: "Role with this name already exists" };
    }

    const role = await prisma.role.create({
      data: {
        name: data.name.toUpperCase(),
        displayName: data.displayName,
        description: data.description,
        permissions: data.permissions || [],
        isSystem: false,
      },
    });

    revalidatePath("/dashboard/settings/roles");

    return { success: true, role };
  } catch (error) {
    console.error("[createRole] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create role",
    };
  }
}

/**
 * Update role
 */
export async function updateRole(
  id: string,
  data: {
    displayName?: string;
    description?: string;
    permissions?: string[];
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    // Check if role exists
    const existing = await prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Role not found" };
    }

    // Don't allow updating system role name
    const role = await prisma.role.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/settings/roles");

    return { success: true, role };
  } catch (error) {
    console.error("[updateRole] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}

/**
 * Delete role
 */
export async function deleteRole(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    // Check if role exists and is not a system role
    const existing = await prisma.role.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Role not found" };
    }

    if (existing.isSystem) {
      return { success: false, error: "Cannot delete system roles" };
    }

    await prisma.role.delete({
      where: { id },
    });

    revalidatePath("/dashboard/settings/roles");

    return { success: true };
  } catch (error) {
    console.error("[deleteRole] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete role",
    };
  }
}

/**
 * Initialize default system roles (run once)
 */
export async function initializeSystemRoles() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await requireRole(user.id, "DEAN");

    const systemRoles = [
      {
        name: "AUTHOR",
        displayName: "Author",
        description: "Can submit and manage their own papers",
        permissions: ["paper:create", "paper:read:own"],
        isSystem: true,
      },
      {
        name: "REVIEWER",
        displayName: "Reviewer",
        description: "Can review assigned papers",
        permissions: ["paper:read:assigned", "paper:review"],
        isSystem: true,
      },
      {
        name: "EDITOR",
        displayName: "Editor",
        description: "Can manage papers, assign reviewers, invite users",
        permissions: ["paper:read", "paper:update", "paper:assign", "user:read", "user:invite"],
        isSystem: true,
      },
      {
        name: "DEAN",
        displayName: "Dean",
        description: "Full system access including role management",
        permissions: ["*"],
        isSystem: true,
      },
    ];

    for (const roleData of systemRoles) {
      await prisma.role.upsert({
        where: { name: roleData.name },
        create: roleData,
        update: {
          displayName: roleData.displayName,
          description: roleData.description,
          permissions: roleData.permissions,
          isSystem: true,
        },
      });
    }

    revalidatePath("/dashboard/settings/roles");

    return { success: true, message: "System roles initialized" };
  } catch (error) {
    console.error("[initializeSystemRoles] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initialize system roles",
    };
  }
}
