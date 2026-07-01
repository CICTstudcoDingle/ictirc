import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ictirc/database";
import { backupPaperToR2 } from "@ictirc/storage";
import { apiAuth } from "@/lib/auth";

/**
 * POST /api/papers/[id]/backup
 * Manually trigger R2 cold storage backup for a paper
 * Restricted to EDITOR and DEAN roles
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await apiAuth("paper:update");
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    // Get paper with file URL
    const paper = await prisma.paper.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        pdfUrl: true,
        rawFileUrl: true,
        r2BackupUrl: true,
        r2BackupAt: true,
      },
    });

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    // Get the file URL to backup (prefer pdfUrl, fallback to rawFileUrl)
    const fileUrl = paper.pdfUrl || paper.rawFileUrl;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file available to backup" },
        { status: 400 },
      );
    }

    // Perform backup to R2
    const result = await backupPaperToR2(paper.id, fileUrl, {
      title: paper.title,
      originalName: `${paper.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
      uploadedBy: auth.user.name || auth.user.email,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Backup failed" },
        { status: 500 },
      );
    }

    // Update paper with backup info
    await prisma.paper.update({
      where: { id },
      data: {
        r2BackupUrl: result.r2Url,
        r2BackupAt: result.backupAt,
      },
    });

    return NextResponse.json({
      success: true,
      r2Url: result.r2Url,
      backupAt: result.backupAt,
      message: "Paper backed up to R2 cold storage successfully",
    });
  } catch (error) {
    console.error("[Backup API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/papers/[id]/backup
 * Get backup status for a paper
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await apiAuth("paper:read");
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const paper = await prisma.paper.findUnique({
      where: { id },
      select: {
        id: true,
        r2BackupUrl: true,
        r2BackupAt: true,
      },
    });

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasBackup: !!paper.r2BackupUrl,
      r2BackupUrl: paper.r2BackupUrl,
      r2BackupAt: paper.r2BackupAt,
    });
  } catch (error) {
    console.error("[Backup API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
