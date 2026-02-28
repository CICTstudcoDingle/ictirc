import { prisma, UserRole, User } from "@ictirc/database";

/**
 * Role hierarchy - higher index = more permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  AUTHOR: 0,
  REVIEWER: 1,
  EDITOR: 2,
  DEAN: 3,
};

/**
 * Route protection configuration
 */
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  "/dashboard": ["AUTHOR", "REVIEWER", "EDITOR", "DEAN"],
  "/dashboard/papers": ["REVIEWER", "EDITOR", "DEAN"],
  "/dashboard/papers/review": ["REVIEWER", "EDITOR", "DEAN"],
  "/dashboard/users": ["EDITOR", "DEAN"],
  "/dashboard/settings": ["DEAN"],
  "/dashboard/system": ["DEAN"],
  "/dashboard/archives": ["EDITOR", "DEAN"],
  "/dashboard/archives/volumes": ["EDITOR", "DEAN"],
  "/dashboard/archives/issues": ["EDITOR", "DEAN"],
  "/dashboard/archives/upload": ["EDITOR", "DEAN"],
  "/dashboard/archives/conferences": ["EDITOR", "DEAN"],
};

/**
 * Permission types for granular access control
 */
export type Permission =
  | "paper:read"
  | "paper:create"
  | "paper:update"
  | "paper:delete"
  | "paper:review"
  | "paper:publish"
  | "paper:revoke-doi"
  | "user:read"
  | "user:create"
  | "user:update"
  | "user:delete"
  | "user:invite"
  | "system:lock"
  | "system:settings"
  | "audit:read"
  | "audit:export"
  | "archive:read"
  | "archive:volume:create"
  | "archive:volume:update"
  | "archive:volume:delete"
  | "archive:issue:create"
  | "archive:issue:update"
  | "archive:issue:delete"
  | "archive:paper:upload"
  | "archive:paper:update"
  | "archive:paper:delete"
  | "archive:conference:manage"
  | "plagiarism:record"
  | "plagiarism:override";

/**
 * Role-based permissions matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  AUTHOR: ["paper:read", "paper:create"],
  REVIEWER: ["paper:read", "paper:review"],
  EDITOR: [
    "paper:read",
    "paper:create",
    "paper:update",
    "paper:review",
    "paper:publish",
    "user:read",
    "user:invite",
    "archive:read",
    "archive:volume:create",
    "archive:volume:update",
    "archive:issue:create",
    "archive:issue:update",
    "archive:paper:upload",
    "archive:paper:update",
    "archive:conference:manage",
    "plagiarism:record",
  ],
  DEAN: [
    "paper:read",
    "paper:create",
    "paper:update",
    "paper:delete",
    "paper:review",
    "paper:publish",
    "paper:revoke-doi",
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    "user:invite",
    "system:lock",
    "system:settings",
    "audit:read",
    "audit:export",
    "archive:read",
    "archive:volume:create",
    "archive:volume:update",
    "archive:volume:delete",
    "archive:issue:create",
    "archive:issue:update",
    "archive:issue:delete",
    "archive:paper:upload",
    "archive:paper:update",
    "archive:paper:delete",
    "archive:conference:manage",
    "plagiarism:record",
    "plagiarism:override",
  ],
};

/**
 * Get user by Supabase Auth ID
 */
export async function getUserById(supabaseId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id: supabaseId },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Check if user has a specific role or higher
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has any of the allowed roles
 */
export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  // Find the most specific matching route
  const matchingRoutes = Object.keys(PROTECTED_ROUTES)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length); // Sort by specificity (longest first)

  if (matchingRoutes.length === 0) {
    return true; // No protection defined = public
  }

  const allowedRoles = PROTECTED_ROUTES[matchingRoutes[0]!];
  return allowedRoles ? hasAnyRole(userRole, allowedRoles) : true;
}

/**
 * Verify user has required permission, throw if not
 */
export async function requirePermission(
  supabaseId: string,
  permission: Permission
): Promise<User> {
  const user = await getUserById(supabaseId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("User account is deactivated");
  }

  if (!hasPermission(user.role, permission)) {
    throw new Error(`Insufficient permissions: requires ${permission}`);
  }

  return user;
}

/**
 * Verify user has required role, throw if not
 */
export async function requireRole(
  supabaseId: string,
  requiredRole: UserRole
): Promise<User> {
  const user = await getUserById(supabaseId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("User account is deactivated");
  }

  if (!hasRole(user.role, requiredRole)) {
    throw new Error(`Insufficient role: requires ${requiredRole} or higher`);
  }

  return user;
}

/**
 * Check if user is the Dean (Super Admin)
 */
export function isDean(userRole: UserRole): boolean {
  return userRole === "DEAN";
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    AUTHOR: "Author",
    REVIEWER: "Reviewer",
    EDITOR: "Editor-in-Chief",
    DEAN: "Dean (Super Admin)",
  };
  return displayNames[role];
}
