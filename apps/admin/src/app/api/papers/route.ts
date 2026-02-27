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

// GET - Fetch papers (current and/or archived)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const type = searchParams.get("type"); // "current" | "archived" | "all"

    const includeArchived = type === "archived" || type === "all" || !type;
    const includeCurrent = type === "current" || type === "all" || !type;

    let papers: any[] = [];
    let archivedPapers: any[] = [];

    // Fetch current papers (Paper model)
    if (includeCurrent && type !== "archived") {
      const where: any = {};
      if (status && status !== "ARCHIVED") where.status = status;
      else if (!status && type !== "all") {
        // When type is "current" or not specified without status filter, exclude archived
        where.status = { notIn: ["ARCHIVED"] };
      }
      if (category) where.categoryId = category;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { abstract: { contains: search, mode: "insensitive" } },
        ];
      }

      papers = await prisma.paper.findMany({
        where,
        include: {
          authors: {
            include: { author: true },
            orderBy: { order: "asc" },
          },
          category: true,
          issue: {
            include: {
              volume: true,
              conference: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Fetch archived papers (ArchivedPaper model) - shown as ARCHIVED status
    if (includeArchived || status === "ARCHIVED") {
      const archiveWhere: any = {};
      if (category) archiveWhere.categoryId = category;
      if (search) {
        archiveWhere.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { abstract: { contains: search, mode: "insensitive" } },
        ];
      }

      const rawArchived = await prisma.archivedPaper.findMany({
        where: archiveWhere,
        include: {
          authors: {
            orderBy: { order: "asc" },
          },
          category: true,
          issue: {
            include: {
              volume: true,
              conference: true,
            },
          },
          uploader: {
            select: { name: true, email: true },
          },
        },
        orderBy: { uploadedAt: "desc" },
      });

      // Normalize ArchivedPaper to match Paper interface
      archivedPapers = rawArchived.map((ap) => ({
        id: ap.id,
        title: ap.title,
        abstract: ap.abstract,
        keywords: ap.keywords,
        status: "ARCHIVED",
        doi: ap.doi ?? null,
        rawFileUrl: ap.pdfUrl,
        pdfUrl: ap.pdfUrl,
        docxUrl: ap.docxUrl ?? null,
        createdAt: ap.createdAt.toISOString(),
        publishedAt: ap.publishedDate.toISOString(),
        pageStart: ap.pageStart ?? null,
        pageEnd: ap.pageEnd ?? null,
        category: ap.category
          ? { id: ap.category.id, name: ap.category.name }
          : null,
        issue: ap.issue
          ? {
            id: ap.issue.id,
            issueNumber: ap.issue.issueNumber,
            volume: ap.issue.volume
              ? {
                id: ap.issue.volume.id,
                volumeNumber: ap.issue.volume.volumeNumber,
                year: ap.issue.volume.year,
              }
              : null,
            conference: ap.issue.conference
              ? { id: ap.issue.conference.id, name: ap.issue.conference.name }
              : null,
          }
          : null,
        authors: ap.authors.map((a) => ({
          author: {
            id: a.id,
            name: a.name,
            email: a.email ?? "",
          },
          order: a.order,
          isCorresponding: a.isCorresponding,
          affiliation: a.affiliation ?? null,
        })),
        uploader: ap.uploader ?? null,
        uploadedAt: ap.uploadedAt?.toISOString() ?? null,
        // Mark as archived paper source for CRUD operations
        _source: "archived",
        _archivedPaperId: ap.id,
      }));
    }

    // When fetching "all" or default, combine both lists
    // When status=ARCHIVED, only return archived
    let result: any[] = [];
    if (status === "ARCHIVED") {
      result = archivedPapers;
    } else if (type === "current") {
      result = papers;
    } else if (type === "archived") {
      result = archivedPapers;
    } else {
      // Default: show current submissions + archived papers together
      result = [...papers, ...archivedPapers];
    }

    return NextResponse.json({ papers: result });
  } catch (error) {
    console.error("Failed to fetch papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 }
    );
  }
}

// PUT - Update paper (or archived paper)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, doi, _source, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Handle ArchivedPaper update
    if (_source === "archived") {
      const updateData: any = {};
      if (doi !== undefined) updateData.doi = doi;
      // Allow updating specific fields for archived papers
      const allowedFields = [
        "title", "abstract", "keywords", "pdfUrl", "docxUrl",
        "pageStart", "pageEnd", "categoryId", "issueId",
      ];
      for (const field of allowedFields) {
        if (rest[field] !== undefined) updateData[field] = rest[field];
      }
      if (rest.publishedDate) {
        updateData.publishedDate = new Date(rest.publishedDate);
      }

      const paper = await prisma.archivedPaper.update({
        where: { id },
        data: updateData,
        include: {
          authors: { orderBy: { order: "asc" } },
          category: true,
          issue: { include: { volume: true } },
        },
      });

      await createAuditLog(
        "UPDATE_ARCHIVED_PAPER",
        id,
        "ArchivedPaper",
        "admin@system",
        { doi: paper.doi },
        ipAddress
      );

      return NextResponse.json({ paper });
    }

    // Handle current Paper update
    const updateData: any = {};
    if (status) updateData.status = status;
    if (doi !== undefined) updateData.doi = doi;

    // Auto-generate DOI when publishing
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
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

// DELETE - Delete paper (or archived paper)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const source = searchParams.get("source"); // "archived" for archived papers

    if (!id) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (source === "archived") {
      // Delete archived paper
      const paper = await prisma.archivedPaper.findUnique({ where: { id } });
      await prisma.archivedPaper.delete({ where: { id } });

      await createAuditLog(
        "DELETE_ARCHIVED_PAPER",
        id,
        "ArchivedPaper",
        "admin@system",
        { title: paper?.title },
        ipAddress
      );
    } else {
    // Delete current paper
      const paper = await prisma.paper.findUnique({ where: { id } });
      await prisma.paper.delete({ where: { id } });

      await createAuditLog(
        "DELETE_PAPER",
        id,
        "Paper",
        "admin@system",
        { title: paper?.title },
        ipAddress
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete paper:", error);
    return NextResponse.json(
      { error: "Failed to delete paper" },
      { status: 500 }
    );
  }
}
