import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, getR2Config } from "./client";

/**
 * Allowed video MIME types
 */
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
] as const;

/**
 * Maximum video file size: 1GB
 */
export const MAX_VIDEO_SIZE = 1 * 1024 * 1024 * 1024; // 1GB

/**
 * Generate R2 key for a promotional video
 */
export function generateVideoR2Key(
  type: "promotional" | "teaser",
  originalName: string
): string {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `videos/${type}/${timestamp}_${sanitizedName}`;
}

/**
 * Generate a presigned URL for direct browser-to-R2 video upload
 * This allows large file uploads (500MB-1GB) without going through the server
 * 
 * @param r2Key - The R2 object key (path) for the video
 * @param contentType - The MIME type of the video
 * @param expiresInSeconds - How long the URL is valid (default: 1 hour)
 */
export async function getVideoUploadPresignedUrl(
  r2Key: string,
  contentType: string,
  expiresInSeconds: number = 3600
): Promise<{ success: boolean; url?: string; r2Key?: string; error?: string }> {
  try {
    const config = getR2Config();
    const client = r2Client();

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: r2Key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      success: true,
      url,
      r2Key,
    };
  } catch (error) {
    console.error("[R2] Video presigned URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate upload URL",
    };
  }
}

/**
 * Generate a presigned URL for reading/streaming a video from R2
 * Used by the public web page to stream videos
 * 
 * @param r2Key - The R2 object key (path) of the video
 * @param expiresInSeconds - How long the URL is valid (default: 24 hours for public viewing)
 */
export async function getVideoStreamUrl(
  r2Key: string,
  expiresInSeconds: number = 86400 // 24 hours for public pages
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Use the existing getR2SignedUrl function pattern
    const { getR2SignedUrl } = await import("./operations");
    const result = await getR2SignedUrl(r2Key, expiresInSeconds);
    
    return {
      success: result.success,
      url: result.url,
      error: result.error,
    };
  } catch (error) {
    console.error("[R2] Video stream URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate stream URL",
    };
  }
}
