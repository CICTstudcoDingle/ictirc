import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/lib/auth";
import * as fs from "fs";
import * as path from "path";

/**
 * GET /api/backup/download?fileName=...
 * Serve a local backup file for download.
 */
export async function GET(request: NextRequest) {
  const auth = await apiAuth("backup:manage");
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 },
      );
    }

    // Sanitize filename to prevent directory traversal
    const sanitized = path.basename(fileName);
    const backupDir = path.join(process.cwd(), "backups");
    const filePath = path.join(backupDir, sanitized);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Backup file not found" },
        { status: 404 },
      );
    }

    const fileContent = fs.readFileSync(filePath);

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${sanitized}"`,
      },
    });
  } catch (error) {
    console.error("[Backup Download] Error:", error);
    return NextResponse.json(
      { error: "Failed to download backup" },
      { status: 500 },
    );
  }
}
