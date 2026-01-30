import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";

export async function GET() {
  try {
    const guides = await prisma.researchGuide.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json({ guides });
  } catch (error) {
    console.error("Failed to fetch research guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch research guides" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, fileUrl } = body;

    if (!title || !category || !fileUrl) {
      return NextResponse.json(
        { error: "Title, category, and fileUrl are required" },
        { status: 400 }
      );
    }

    const guide = await prisma.researchGuide.create({
      data: {
        title,
        description,
        category,
        fileUrl,
      },
    });

    return NextResponse.json({ guide });
  } catch (error) {
    console.error("Failed to create research guide:", error);
    return NextResponse.json(
      { error: "Failed to create research guide" },
      { status: 500 }
    );
  }
}
