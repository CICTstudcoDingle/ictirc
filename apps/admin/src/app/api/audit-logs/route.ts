import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";
import { apiAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await apiAuth("audit:read");
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const action = searchParams.get("action");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (action) {
      where.action = { contains: action, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { actorEmail: { contains: search, mode: "insensitive" } },
        { targetId: { contains: search, mode: "insensitive" } },
        { targetType: { contains: search, mode: "insensitive" } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}
