import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import * as path from "path";
import * as fs from "fs";

/**
 * POST /api/backup/database
 * Trigger a database backup (Prisma export method)
 * Restricted to DEAN role only
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role - only DEAN can trigger backups
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true },
    });

    if (!dbUser || dbUser.role !== "DEAN") {
      return NextResponse.json(
        { error: "Only the Dean can trigger database backups" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const uploadToGdrive = body.uploadToGdrive || false;

    // Backup directory
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `ictirc_export_${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);

    // Export all tables using Prisma
    const [
      users,
      authors,
      papers,
      categories,
      volumes,
      issues,
      conferences,
      paperAuthors,
      paperComments,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.author.findMany(),
      prisma.paper.findMany(),
      prisma.category.findMany(),
      prisma.volume.findMany(),
      prisma.issue.findMany(),
      prisma.conference.findMany(),
      prisma.paperAuthor.findMany(),
      prisma.paperComment.findMany(),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      exportedBy: dbUser.name || user.email,
      version: "1.0",
      tables: {
        users: users.length,
        authors: authors.length,
        papers: papers.length,
        categories: categories.length,
        volumes: volumes.length,
        issues: issues.length,
        conferences: conferences.length,
        paperAuthors: paperAuthors.length,
        paperComments: paperComments.length,
      },
      data: {
        users,
        authors,
        papers,
        categories,
        volumes,
        issues,
        conferences,
        paperAuthors,
        paperComments,
      },
    };

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    const stats = fs.statSync(filePath);

    // Google Drive upload (if configured) - placeholder for future implementation
    let driveResult = null;
    if (uploadToGdrive) {
      const gdriveEmail = process.env.GDRIVE_SERVICE_EMAIL;
      const gdriveKey = process.env.GDRIVE_PRIVATE_KEY;
      const gdriveFolderId = process.env.GDRIVE_BACKUP_FOLDER_ID;

      if (gdriveEmail && gdriveKey && gdriveFolderId) {
        // TODO: Implement Google Drive upload when @ictirc/backup package is created
        // For now, just mark as not implemented
        driveResult = {
          success: false,
          error: "Google Drive upload not yet configured. Install googleapis package and create @ictirc/backup."
        };
        console.log("[Backup] Google Drive upload skipped - package not installed");
      }
    }

    return NextResponse.json({
      success: true,
      backup: {
        fileName,
        filePath,
        fileSize: stats.size,
        createdAt: new Date().toISOString(),
        tableStats: exportData.tables,
      },
      driveUpload: driveResult,
    });
  } catch (error) {
    console.error("[Backup API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/backup/database
 * List existing backups
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || !["EDITOR", "DEAN"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const backupDir = path.join(process.cwd(), "backups");
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter((f) => f.endsWith(".json") || f.endsWith(".sql"))
      .map((fileName) => {
        const filePath = path.join(backupDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          fileName,
          fileSize: stats.size,
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ backups: files });
  } catch (error) {
    console.error("[Backup API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
