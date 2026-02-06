import * as fs from "fs";
import * as path from "path";
import { createDatabaseBackup, createPrismaExport, type BackupResult } from "./postgres";
import { uploadToGoogleDrive, cleanupOldBackups, type DriveUploadResult, type GoogleDriveConfig } from "./google-drive";

export interface FullBackupResult {
  success: boolean;
  localBackup?: BackupResult;
  driveUpload?: DriveUploadResult;
  cleanupResult?: { deletedCount: number };
  error?: string;
}

export interface FullBackupConfig {
  /** Local backup directory */
  localDir: string;
  /** Whether to upload to Google Drive */
  uploadToGdrive?: boolean;
  /** Google Drive configuration (required if uploadToGdrive is true) */
  gdriveConfig?: GoogleDriveConfig;
  /** Whether to use Prisma export instead of pg_dump */
  usePrismaExport?: boolean;
  /** How many backups to keep in Google Drive */
  keepCount?: number;
  /** Whether to delete local backup after successful Drive upload */
  deleteLocalAfterUpload?: boolean;
}

/**
 * Perform a full database backup
 * 1. Create local backup (pg_dump or Prisma export)
 * 2. Optionally upload to Google Drive
 * 3. Optionally cleanup old backups
 */
export async function performFullBackup(
  config: FullBackupConfig
): Promise<FullBackupResult> {
  try {
    // Step 1: Create local backup
    console.log("[Backup] Starting local backup...");
    
    let localBackup: BackupResult;
    
    if (config.usePrismaExport) {
      localBackup = await createPrismaExport({
        outputDir: config.localDir,
        prefix: "ictirc",
      });
    } else {
      localBackup = await createDatabaseBackup({
        outputDir: config.localDir,
        prefix: "ictirc",
      });
    }

    if (!localBackup.success || !localBackup.filePath) {
      return {
        success: false,
        localBackup,
        error: localBackup.error || "Local backup failed",
      };
    }

    console.log(`[Backup] Local backup created: ${localBackup.fileName}`);

    // Step 2: Upload to Google Drive (optional)
    let driveUpload: DriveUploadResult | undefined;
    let cleanupResult: { deletedCount: number } | undefined;

    if (config.uploadToGdrive && config.gdriveConfig) {
      console.log("[Backup] Uploading to Google Drive...");
      
      driveUpload = await uploadToGoogleDrive(
        localBackup.filePath,
        config.gdriveConfig
      );

      if (driveUpload.success) {
        console.log(`[Backup] Uploaded to Drive: ${driveUpload.fileId}`);

        // Step 3: Cleanup old backups
        const keepCount = config.keepCount || 6;
        const cleanup = await cleanupOldBackups(config.gdriveConfig, keepCount);
        
        if (cleanup.success) {
          cleanupResult = { deletedCount: cleanup.deletedCount || 0 };
          console.log(`[Backup] Cleaned up ${cleanupResult.deletedCount} old backups`);
        }

        // Optionally delete local file after successful upload
        if (config.deleteLocalAfterUpload && localBackup.filePath) {
          fs.unlinkSync(localBackup.filePath);
          console.log("[Backup] Deleted local backup after Drive upload");
        }
      } else {
        console.error("[Backup] Drive upload failed:", driveUpload.error);
      }
    }

    return {
      success: true,
      localBackup,
      driveUpload,
      cleanupResult,
    };
  } catch (error) {
    console.error("[Backup] Full backup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get list of local backup files
 */
export function getLocalBackups(backupDir: string): Array<{
  fileName: string;
  filePath: string;
  size: number;
  createdAt: Date;
}> {
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const files = fs.readdirSync(backupDir);
  
  return files
    .filter((f) => f.endsWith(".sql") || f.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(backupDir, fileName);
      const stats = fs.statSync(filePath);
      return {
        fileName,
        filePath,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
