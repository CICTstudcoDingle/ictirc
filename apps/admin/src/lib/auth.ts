import { NextResponse, type NextRequest } from "next/server";
import { prisma, type User, type UserRole } from "@ictirc/database";
import { hasPermission, hasRole, type Permission } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export type AuthSuccess = {
  success: true;
  user: User;
  supabaseUserId: string;
  email?: string;
};

export type AuthFailure = {
  success: false;
  error: string;
  status: 401 | 403;
};

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Authenticate the current Supabase session and resolve the matching
 * Prisma user record. Returns a standardized failure object on error.
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Unauthorized", status: 401 };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "User not found", status: 401 };
    }

    if (!dbUser.isActive) {
      return { success: false, error: "Account deactivated", status: 403 };
    }

    return {
      success: true,
      user: dbUser,
      supabaseUserId: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("[getCurrentUser] Authentication error:", error);
    return { success: false, error: "Authentication failed", status: 401 };
  }
}

/**
 * Require a specific permission. Resolves the current user once and checks
 * the permission without an extra Prisma lookup.
 */
export async function requirePermission(
  permission: Permission,
): Promise<AuthResult> {
  const auth = await getCurrentUser();
  if (!auth.success) return auth;

  if (!hasPermission(auth.user.role, permission)) {
    return {
      success: false,
      error: `Insufficient permissions: ${permission}`,
      status: 403,
    };
  }

  return auth;
}

/**
 * Require a specific role or higher in the role hierarchy.
 */
export async function requireRole(role: UserRole): Promise<AuthResult> {
  const auth = await getCurrentUser();
  if (!auth.success) return auth;

  if (!hasRole(auth.user.role, role)) {
    return {
      success: false,
      error: `Insufficient role: ${role} or higher required`,
      status: 403,
    };
  }

  return auth;
}

/**
 * Generic API-route guard. Returns either the authenticated user or a
 * NextResponse that should be returned immediately.
 */
export async function apiAuth(
  options?: Permission | { permission?: Permission; role?: UserRole },
): Promise<
  | { user: User; response?: undefined }
  | { user?: undefined; response: NextResponse }
> {
  const permission =
    typeof options === "string" ? options : options?.permission;
  const role = typeof options === "string" ? undefined : options?.role;

  const auth = permission
    ? await requirePermission(permission)
    : role
      ? await requireRole(role)
      : await getCurrentUser();

  if (!auth.success) {
    return {
      response: NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status },
      ),
    };
  }

  return { user: auth.user };
}

/**
 * Standard unauthorized response for API routes.
 */
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

/**
 * Standard forbidden response for API routes.
 */
export function forbidden(message = "Forbidden") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

/**
 * Helper for server actions: returns either the user or a standardized
 * failure payload. Use it at the top of every action:
 *
 *   const auth = await actionAuth("paper:read");
 *   if (!auth.success) return { success: false, error: auth.error };
 */
export async function actionAuth(
  options?: Permission | { permission?: Permission; role?: UserRole },
): Promise<AuthSuccess | { success: false; error: string }> {
  const permission =
    typeof options === "string" ? options : options?.permission;
  const role = typeof options === "string" ? undefined : options?.role;

  const auth = permission
    ? await requirePermission(permission)
    : role
      ? await requireRole(role)
      : await getCurrentUser();

  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  return auth;
}
