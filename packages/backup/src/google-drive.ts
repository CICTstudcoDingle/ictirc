import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  error?: string;
}

export interface GoogleDriveConfig {
  /** Service account email */
  clientEmail: string;
  /** Service account private key */
  privateKey: string;
  /** Google Drive folder ID to upload to */
  folderId: string;
}

/**
 * Upload a file to Google Drive using service account
 */
export async function uploadToGoogleDrive(
  filePath: string,
  config: GoogleDriveConfig
): Promise<DriveUploadResult> {
  try {
    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey.replace(/\\n/g, "\n"), // Handle escaped newlines
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: [config.folderId],
    };

    // Create media object
    const media = {
      mimeType: "application/octet-stream",
      body: fs.createReadStream(filePath),
    };

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, name",
    });

    if (!response.data.id) {
      return {
        success: false,
        error: "Failed to get file ID from Google Drive",
      };
    }

    return {
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink || undefined,
    };
  } catch (error) {
    console.error("[Backup] Google Drive upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * List backup files in Google Drive folder
 */
export async function listDriveBackups(
  config: GoogleDriveConfig
): Promise<{ success: boolean; files?: Array<{ id: string; name: string; createdTime: string }>; error?: string }> {
  try {
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${config.folderId}' in parents and trashed=false`,
      fields: "files(id, name, createdTime, size)",
      orderBy: "createdTime desc",
      pageSize: 50,
    });

    const files = response.data.files?.map((f) => ({
      id: f.id || "",
      name: f.name || "",
      createdTime: f.createdTime || "",
    })) || [];

    return { success: true, files };
  } catch (error) {
    console.error("[Backup] List Drive backups error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete old backups from Google Drive (keep last N)
 */
export async function cleanupOldBackups(
  config: GoogleDriveConfig,
  keepCount: number = 6
): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const listResult = await listDriveBackups(config);
    if (!listResult.success || !listResult.files) {
      return { success: false, error: listResult.error };
    }

    if (listResult.files.length <= keepCount) {
      return { success: true, deletedCount: 0 };
    }

    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Delete files beyond keepCount
    const filesToDelete = listResult.files.slice(keepCount);
    let deletedCount = 0;

    for (const file of filesToDelete) {
      await drive.files.delete({ fileId: file.id });
      deletedCount++;
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error("[Backup] Cleanup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
