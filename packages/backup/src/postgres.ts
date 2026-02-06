import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

export interface BackupResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
  createdAt?: Date;
}

export interface BackupConfig {
  /** Directory to save backup files */
  outputDir: string;
  /** Database connection URL (postgres://...) */
  databaseUrl?: string;
  /** Optional prefix for backup filename */
  prefix?: string;
}

/**
 * Create a PostgreSQL database backup using pg_dump
 * Saves to local filesystem with timestamp
 */
export async function createDatabaseBackup(
  config: BackupConfig
): Promise<BackupResult> {
  try {
    const databaseUrl = config.databaseUrl || process.env.DATABASE_URL;

    if (!databaseUrl) {
      return {
        success: false,
        error: "DATABASE_URL not configured",
      };
    }

    // Parse connection URL for pg_dump
    const url = new URL(databaseUrl);
    const host = url.hostname;
    const port = url.port || "5432";
    const database = url.pathname.slice(1); // Remove leading /
    const username = url.username;
    const password = url.password;

    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const prefix = config.prefix || "ictirc";
    const fileName = `${prefix}_backup_${timestamp}.sql`;
    const filePath = path.join(config.outputDir, fileName);

    // Build pg_dump command
    // Note: We use environment variable for password (PGPASSWORD) for security
    const pgDumpCommand = [
      `pg_dump`,
      `-h ${host}`,
      `-p ${port}`,
      `-U ${username}`,
      `-d ${database}`,
      `--no-owner`,
      `--no-acl`,
      `-f "${filePath}"`,
    ].join(" ");

    // Execute pg_dump with password in environment
    await execAsync(pgDumpCommand, {
      env: {
        ...process.env,
        PGPASSWORD: password,
      },
    });

    // Get file stats
    const stats = fs.statSync(filePath);

    return {
      success: true,
      filePath,
      fileName,
      fileSize: stats.size,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("[Backup] PostgreSQL dump error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown backup error",
    };
  }
}

/**
 * Create a backup using Prisma's built-in export (alternative method)
 * Exports data as JSON - useful when pg_dump is not available
 */
export async function createPrismaExport(
  config: BackupConfig
): Promise<BackupResult> {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import("@ictirc/database");

    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const prefix = config.prefix || "ictirc";
    const fileName = `${prefix}_export_${timestamp}.json`;
    const filePath = path.join(config.outputDir, fileName);

    // Export all tables
    const [
      users,
      authors,
      papers,
      categories,
      volumes,
      issues,
      conferences,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.author.findMany(),
      prisma.paper.findMany({ include: { authors: true } }),
      prisma.category.findMany(),
      prisma.volume.findMany(),
      prisma.issue.findMany(),
      prisma.conference.findMany(),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      tables: {
        users,
        authors,
        papers,
        categories,
        volumes,
        issues,
        conferences,
      },
    };

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

    const stats = fs.statSync(filePath);

    return {
      success: true,
      filePath,
      fileName,
      fileSize: stats.size,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("[Backup] Prisma export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown export error",
    };
  }
}
