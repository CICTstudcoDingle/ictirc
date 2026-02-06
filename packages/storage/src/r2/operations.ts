import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, getR2Config } from "./client";
import type { UploadResult, SignedUrlResult, FileMetadata } from "../types";

/**
 * Upload a file to R2 Cold Storage
 * Used for backup/archival of original manuscripts
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  path: string,
  metadata?: Partial<FileMetadata>
): Promise<UploadResult> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: path,
      Body: file,
      ContentType: metadata?.mimeType || "application/octet-stream",
      Metadata: metadata
        ? {
            paperId: metadata.paperId || "",
            originalName: metadata.originalName || "",
            uploadedBy: metadata.uploadedBy || "",
            uploadedAt: metadata.uploadedAt?.toISOString() || new Date().toISOString(),
          }
        : undefined,
    });

    await client.send(command);

    return {
      success: true,
      path,
      url: `${config.endpoint}/${config.bucketName}/${path}`,
    };
  } catch (error) {
    console.error("[R2] Upload error:", error);
    return {
      success: false,
      path,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * Download a file from R2 Cold Storage
 */
export async function downloadFromR2(
  path: string
): Promise<{ success: boolean; data?: Buffer; error?: string }> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: path,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return { success: false, error: "Empty response body" };
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);

    return { success: true, data };
  } catch (error) {
    console.error("[R2] Download error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown download error",
    };
  }
}

/**
 * Delete a file from R2 Cold Storage
 * RESTRICTED: Only Dean/Super Admin should have access
 */
export async function deleteFromR2(
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: path,
    });

    await client.send(command);

    return { success: true };
  } catch (error) {
    console.error("[R2] Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}

/**
 * Generate a time-limited signed URL for R2 file access
 * Default expiry: 1 hour (as per security protocol)
 */
export async function getR2SignedUrl(
  path: string,
  expiresInSeconds: number = 3600 // 1 hour default
): Promise<SignedUrlResult> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: path,
    });

    const url = await getSignedUrl(client, command, {
      expiresIn: expiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    return {
      success: true,
      url,
      expiresAt,
    };
  } catch (error) {
    console.error("[R2] Signed URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error generating signed URL",
    };
  }
}

/**
 * Copy a file from Supabase Hot Storage to R2 Cold Storage
 * Used for daily backups and archival
 */
export async function copyToR2ColdStorage(
  sourceBuffer: Buffer,
  destinationPath: string,
  metadata?: Partial<FileMetadata>
): Promise<UploadResult> {
  // This function accepts a buffer from Supabase and uploads to R2
  return uploadToR2(sourceBuffer, destinationPath, metadata);
}

/**
 * Copy a file within R2 (e.g., from raw to branded folder)
 */
export async function copyWithinR2(
  sourcePath: string,
  destinationPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new CopyObjectCommand({
      Bucket: config.bucketName,
      CopySource: `${config.bucketName}/${sourcePath}`,
      Key: destinationPath,
    });

    await client.send(command);

    return { success: true };
  } catch (error) {
    console.error("[R2] Copy error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown copy error",
    };
  }
}

/**
 * Backup a paper to R2 Cold Storage
 * Downloads from Supabase hot storage and uploads to R2 with metadata
 * Returns the R2 URL for database update
 */
export async function backupPaperToR2(
  paperId: string,
  supabaseFileUrl: string,
  metadata?: {
    title?: string;
    originalName?: string;
    uploadedBy?: string;
  }
): Promise<{
  success: boolean;
  r2Url?: string;
  backupAt?: Date;
  error?: string;
}> {
  try {
    // Download file from Supabase URL
    const response = await fetch(supabaseFileUrl);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to download from Supabase: ${response.statusText}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension from URL or content type
    const contentType = response.headers.get("content-type") || "application/pdf";
    let extension = "pdf";
    if (contentType.includes("docx")) {
      extension = "docx";
    } else if (contentType.includes("doc")) {
      extension = "doc";
    }

    // Generate R2 path: papers/{year}/{paperId}/{filename}
    const year = new Date().getFullYear();
    const filename = metadata?.originalName || `paper.${extension}`;
    const r2Path = `papers/${year}/${paperId}/${filename}`;

    // Upload to R2 with metadata
    const result = await uploadToR2(buffer, r2Path, {
      paperId,
      originalName: filename,
      mimeType: contentType.includes("docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/pdf",
      uploadedBy: metadata?.uploadedBy || "system",
      uploadedAt: new Date(),
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      r2Url: result.url,
      backupAt: new Date(),
    };
  } catch (error) {
    console.error("[R2] Backup paper error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown backup error",
    };
  }
}

