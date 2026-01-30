import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";

export async function GET() {
  try {
    const guides = await prisma.researchGuide.findMany({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    // Group guides by category
    const groupedGuides = guides.reduce(
      (acc, guide) => {
        const category = guide.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(guide);
        return acc;
      },
      {} as Record<string, typeof guides>
    );

    return NextResponse.json({ guides, groupedGuides });
  } catch (error) {
    console.error("Failed to fetch research guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch research guides" },
      { status: 500 }
    );
  }
}
