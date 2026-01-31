import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ictirc/database";
import { generateDoi } from "@/lib/doi";

// Helper: Create audit log
async function createAuditLog(
  action: string,
  targetId: string,
  targetType: string,
  actorEmail: string,
  metadata?: any,
  ipAddress?: string
) {
  await prisma.auditLog.create({
    data: {
      actorId: actorEmail,
      actorEmail,
      action,
      targetId,
      targetType,
      metadata,
      ipAddress,
    },
  });
}

// GET - Fetch all papers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) where.status = status;
    if (category) where.categoryId = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
      ];
    }

    const papers = await prisma.paper.findMany({
      where,
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: "asc" },
        },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ papers });
  } catch (error) {
    console.error("Failed to fetch papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 }
    );
  }
}

// PUT - Update paper
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, doi } = body;

    if (!id) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (doi !== undefined) updateData.doi = doi;

    // Auto-generate DOI when publishing
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
      
      // Generate DOI if not provided
      if (!doi) {
        const generatedDoi = await generateDoi();
        updateData.doi = generatedDoi;
      }
    }

    const paper = await prisma.paper.update({
      where: { id },
      data: updateData,
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    // Create audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    await createAuditLog(
      status ? "UPDATE_PAPER_STATUS" : "UPDATE_PAPER",
      id,
      "Paper",
      "admin@system",
      { previousStatus: status, newStatus: paper.status, doi: paper.doi },
      ipAddress
    );

    return NextResponse.json({ paper });
  } catch (error) {
    console.error("Failed to update paper:", error);
    return NextResponse.json(
      { error: "Failed to update paper" },
      { status: 500 }
    );
  }
}

// DELETE - Delete paper
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 });
    }

    const paper = await prisma.paper.findUnique({ where: { id } });
    
    await prisma.paper.delete({
      where: { id },
    });

    // Create audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    await createAuditLog(
      "DELETE_PAPER",
      id,
      "Paper",
      "admin@system",
      { title: paper?.title },
      ipAddress
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete paper:", error);
    return NextResponse.json(
      { error: "Failed to delete paper" },
      { status: 500 }
    );
  }
}
