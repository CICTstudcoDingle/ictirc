import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma, UserRole } from "@ictirc/database";

/**
 * Role hierarchy - higher index = more permissions
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  AUTHOR: 0,
  REVIEWER: 1,
  EDITOR: 2,
  DEAN: 3,
};

/**
 * Route protection configuration
 * Maps route prefixes to minimum required roles
 */
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  "/dashboard/system": ["DEAN"],
  "/dashboard/settings": ["DEAN"],
  "/dashboard/users": ["EDITOR", "DEAN"],
  "/dashboard/papers/review": ["REVIEWER", "EDITOR", "DEAN"],
  "/dashboard/papers": ["REVIEWER", "EDITOR", "DEAN"],
  "/dashboard": ["AUTHOR", "REVIEWER", "EDITOR", "DEAN"],
};

/**
 * Check if user role is in allowed roles
 */
function hasAllowedRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Get required roles for a pathname
 */
function getRequiredRoles(pathname: string): UserRole[] | null {
  // Find the most specific matching route (longest prefix)
  const matchingRoutes = Object.keys(PROTECTED_ROUTES)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length);

  if (matchingRoutes.length === 0) {
    return null; // No protection required
  }

  return PROTECTED_ROUTES[matchingRoutes[0]!] || null;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Auth Guard for /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // RBAC Check - Get user from database
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true, isActive: true },
      });

      // User not in database - deny access
      if (!dbUser) {
        console.warn(`[RBAC] User ${authUser.email} not found in database`);
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        url.searchParams.set("reason", "no_account");
        return NextResponse.redirect(url);
      }

      // User is deactivated
      if (!dbUser.isActive) {
        console.warn(`[RBAC] User ${authUser.email} account is deactivated`);
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        url.searchParams.set("reason", "deactivated");
        return NextResponse.redirect(url);
      }

      // Check route permissions
      const requiredRoles = getRequiredRoles(pathname);
      if (requiredRoles && !hasAllowedRole(dbUser.role, requiredRoles)) {
        console.warn(
          `[RBAC] User ${authUser.email} (${dbUser.role}) denied access to ${pathname}`
        );
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        url.searchParams.set("reason", "insufficient_role");
        url.searchParams.set("required", requiredRoles.join(","));
        return NextResponse.redirect(url);
      }

      // Add user role to response headers for client-side use
      response.headers.set("x-user-role", dbUser.role);
    } catch (error) {
      console.error("[RBAC] Database error:", error);
    // On database error, allow through but log
    // Production should handle this more gracefully
    }
  }

  // Redirect authenticated users from /login to /dashboard
  if (pathname === "/login") {
    if (authUser) {
      const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
      const url = request.nextUrl.clone();
      url.pathname = redirectTo;
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }
  }

  // Redirect root to /login (or /dashboard if auth)
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = authUser ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
