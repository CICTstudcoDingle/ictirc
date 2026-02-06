import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";

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

    const { name, affiliation } = await request.json();

    // Update user name
    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });

    // Update author affiliation
    await prisma.author.update({
      where: { email: user.email! },
      data: { name, affiliation },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Profile API] Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
