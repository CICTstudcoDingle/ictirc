import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const invites = await prisma.inviteToken.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Failed to fetch invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.inviteToken.create({
      data: {
        email,
        role: role || "AUTHOR",
        expiresAt,
      },
    });

    // TODO: Send email via Resend when configured
    // For now, return token for manual copying

    return NextResponse.json({ 
      token: invite.token,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error("Failed to create invite:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}
