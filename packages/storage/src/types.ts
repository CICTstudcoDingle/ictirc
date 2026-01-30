import { z } from "zod";

/**
 * Supported file types for manuscript uploads
 */
export const ALLOWED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES;

/**
 * Maximum file size: 50MB
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 50MB",
    })
    .refine((file) => Object.keys(ALLOWED_FILE_TYPES).includes(file.type), {
      message: "File must be a PDF or DOCX",
    }),
});

/**
 * Storage bucket types
 */
export type StorageBucket = "hot" | "cold";

/**
 * Upload result from storage operations
 */
export interface UploadResult {
  success: boolean;
  path: string;
  url?: string;
  error?: string;
}

/**
 * Signed URL result
 */
export interface SignedUrlResult {
  success: boolean;
  url?: string;
  expiresAt?: Date;
  error?: string;
}

/**
 * File metadata for storage
 */
export interface FileMetadata {
  paperId: string;
  originalName: string;
  mimeType: AllowedMimeType;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  isWatermarked?: boolean;
}

/**
 * Generate a unique file path for storage
 */
export function generateFilePath(
  paperId: string,
  originalName: string,
  prefix: "raw" | "branded" | "review" = "raw"
): string {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `papers/${paperId}/${prefix}/${timestamp}_${sanitizedName}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  return ALLOWED_FILE_TYPES[mimeType as AllowedMimeType] || ".bin";
}
