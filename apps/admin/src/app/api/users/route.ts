import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";
import { apiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await apiAuth("user:read");
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role");

    const where: any = {};

    // Support filtering by role (comma-separated)
    if (roleParam) {
      const roles = roleParam.split(",");
      where.role = { in: roles };
      where.isActive = true;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Return both formats for backward compatibility
    return NextResponse.json(roleParam ? users : { users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
