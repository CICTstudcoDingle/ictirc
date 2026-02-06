import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma, UserRole } from "@ictirc/database";

/**
 * Sync Authenticated User to Database
 * 
 * This endpoint ensures the authenticated Supabase user has corresponding
 * User and Author records in the database. Use this to fix users who
 * logged in before the callback handler was implemented.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized - no authenticated user" },
        { status: 401 }
      );
    }

    // Get user metadata from Supabase
    const metadata = user.user_metadata || {};
    const name = metadata.name || user.email.split("@")[0] || "Author";
    const affiliation = metadata.affiliation || "ISUFST - CICT";

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name,
      },
      create: {
        id: user.id,
        email: user.email,
        name,
        role: UserRole.AUTHOR,
        isActive: true,
      },
    });

    // Also create/update Author record for paper matching
    const author = await prisma.author.upsert({
      where: { email: user.email },
      update: {
        name,
        affiliation,
      },
      create: {
        email: user.email,
        name,
        affiliation,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      },
      author: {
        email: author.email,
        affiliation: author.affiliation,
      },
    });
  } catch (error) {
    console.error("[Sync API] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to sync user to database",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
