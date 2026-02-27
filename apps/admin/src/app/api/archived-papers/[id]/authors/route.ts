import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ictirc/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/archived-papers/[id]/authors
// Replace all authors for an archived paper
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { authors } = body;

    if (!Array.isArray(authors)) {
      return NextResponse.json({ error: "Authors array required" }, { status: 400 });
    }

    // Verify paper exists
    const paper = await prisma.archivedPaper.findUnique({ where: { id } });
    if (!paper) {
      return NextResponse.json({ error: "Archived paper not found" }, { status: 404 });
    }

    // Delete existing authors and create new ones in a transaction
    await prisma.$transaction([
      prisma.archivedPaperAuthor.deleteMany({ where: { paperId: id } }),
      prisma.archivedPaperAuthor.createMany({
        data: authors.map((a: any, i: number) => ({
          paperId: id,
          name: a.name,
          email: a.email || null,
          affiliation: a.affiliation || null,
          order: a.order ?? i,
          isCorresponding: a.isCorresponding ?? false,
        })),
      }),
    ]);

    const updatedAuthors = await prisma.archivedPaperAuthor.findMany({
      where: { paperId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ authors: updatedAuthors });
  } catch (error) {
    console.error("Failed to update archived paper authors:", error);
    return NextResponse.json({ error: "Failed to update authors" }, { status: 500 });
  }
}

// GET /api/archived-papers/[id]/authors
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const authors = await prisma.archivedPaperAuthor.findMany({
      where: { paperId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Failed to fetch archived paper authors:", error);
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}
