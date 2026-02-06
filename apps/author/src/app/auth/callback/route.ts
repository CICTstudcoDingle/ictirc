import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { prisma, UserRole } from "@ictirc/database";

/**
 * Auth Callback Handler
 * 
 * This route handles the OAuth callback from Supabase after email verification.
 * It creates/updates the user record in the database and redirects to dashboard.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard";

  if (code) {
    const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth Callback] Error exchanging code:", error);
      return NextResponse.redirect(new URL("/login?error=auth_failed", requestUrl.origin));
    }

    if (user) {
      try {
        // Get user metadata from Supabase
        const metadata = user.user_metadata || {};
        const name = metadata.name || user.email?.split("@")[0] || "Author";
        const affiliation = metadata.affiliation || "ISUFST - CICT";

        // Create or update user in database
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email!,
            name,
          },
          create: {
            id: user.id,
            email: user.email!,
            name,
            role: UserRole.AUTHOR, // Default role for new authors
            isActive: true,
          },
        });

        // Also create/update Author record for paper matching
        await prisma.author.upsert({
          where: { email: user.email! },
          update: {
            name,
            affiliation,
          },
          create: {
            email: user.email!,
            name,
            affiliation,
          },
        });

        console.log(`[Auth Callback] User ${user.email} created/updated successfully`);
      } catch (dbError) {
        console.error("[Auth Callback] Database error:", dbError);
        // Continue anyway - user can access but may need to complete profile
      }
    }

    return response;
  }

  // No code present - redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
