import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";

/**
 * Update admin profile (name, position)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, position } = await request.json();

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
        position: position || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Profile API] Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
