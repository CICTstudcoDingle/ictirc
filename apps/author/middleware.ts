import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@ictirc/database";

/**
 * Author App Middleware
 * 
 * Protects all dashboard routes - requires authentication and AUTHOR/REVIEWER/EDITOR/DEAN roles
 * Guest users are redirected to login
 */
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

  // Protected Dashboard Routes - require auth
  if (pathname.startsWith("/dashboard")) {
    if (!authUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Verify user exists in database with appropriate role
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true, isActive: true },
      });

      // User not in database - they need to complete registration
      if (!dbUser) {
        const url = request.nextUrl.clone();
        url.pathname = "/register";
        url.searchParams.set("step", "complete");
        return NextResponse.redirect(url);
      }

      // User is deactivated
      if (!dbUser.isActive) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "deactivated");
        return NextResponse.redirect(url);
      }

      // Add user info to response headers for client-side use
      response.headers.set("x-user-role", dbUser.role);
    } catch (error) {
      console.error("[Author Middleware] Database error:", error);
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

  // Redirect root to /dashboard if auth, otherwise /login
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
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
