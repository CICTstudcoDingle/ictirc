import { createStorageClient, getSupabaseStorageConfig } from "./client";
import type { UploadResult, SignedUrlResult } from "../types";

/**
 * Upload a file to Supabase Hot Storage (manuscripts bucket)
 * This is the primary storage for active manuscripts
 */
export async function uploadToHotStorage(
  file: File | Buffer,
  path: string,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const { data, error } = await client.storage
      .from(config.bucketName)
      .upload(path, file, {
        contentType: options?.contentType || "application/octet-stream",
        upsert: options?.upsert || false,
      });

    if (error) {
      return {
        success: false,
        path,
        error: error.message,
      };
    }

    // Get the public URL
    const { data: urlData } = client.storage
      .from(config.bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("[Supabase Storage] Upload error:", error);
    return {
      success: false,
      path,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * Download a file from Supabase Hot Storage
 */
export async function downloadFromHotStorage(
  path: string
): Promise<{ success: boolean; data?: Blob; error?: string }> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const { data, error } = await client.storage
      .from(config.bucketName)
      .download(path);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[Supabase Storage] Download error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown download error",
    };
  }
}

/**
 * Delete a file from Supabase Hot Storage
 */
export async function deleteFromHotStorage(
  paths: string | string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const pathArray = Array.isArray(paths) ? paths : [paths];

    const { error } = await client.storage
      .from(config.bucketName)
      .remove(pathArray);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Supabase Storage] Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}

/**
 * Generate a time-limited signed URL for private file access
 * Default expiry: 1 hour (3600 seconds)
 */
export async function getHotStorageSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<SignedUrlResult> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const { data, error } = await client.storage
      .from(config.bucketName)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    return {
      success: true,
      url: data.signedUrl,
      expiresAt,
    };
  } catch (error) {
    console.error("[Supabase Storage] Signed URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error generating signed URL",
    };
  }
}

/**
 * Get the public URL for a file (only works if bucket is public)
 */
export function getPublicUrl(path: string): string {
  const config = getSupabaseStorageConfig();
  const client = createStorageClient();

  const { data } = client.storage
    .from(config.bucketName)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Move a file within Supabase Storage
 */
export async function moveInHotStorage(
  fromPath: string,
  toPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const { error } = await client.storage
      .from(config.bucketName)
      .move(fromPath, toPath);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Supabase Storage] Move error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown move error",
    };
  }
}

/**
 * Copy a file within Supabase Storage
 */
export async function copyInHotStorage(
  fromPath: string,
  toPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSupabaseStorageConfig();
    const client = createStorageClient();

    const { error } = await client.storage
      .from(config.bucketName)
      .copy(fromPath, toPath);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Supabase Storage] Copy error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown copy error",
    };
  }
}
