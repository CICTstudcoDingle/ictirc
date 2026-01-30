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
        isPublished: true,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, category, fileUrl, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Guide ID is required" },
        { status: 400 }
      );
    }

    const guide = await prisma.researchGuide.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(fileUrl && { fileUrl }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ guide });
  } catch (error) {
    console.error("Failed to update research guide:", error);
    return NextResponse.json(
      { error: "Failed to update research guide" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Guide ID is required" },
        { status: 400 }
      );
    }

    await prisma.researchGuide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete research guide:", error);
    return NextResponse.json(
      { error: "Failed to delete research guide" },
      { status: 500 }
    );
  }
}
