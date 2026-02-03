// Storage Package - ICTIRC Research Repository
// Hot Storage: Supabase Storage (archive bucket)
// Cold Storage: Cloudflare R2 (cict-cold-storage bucket)

export * from "./r2";
export * from "./supabase";
export * from "./types";

import { createClient } from "@supabase/supabase-js";

/**
 * Universal file upload function for different Supabase buckets
 * Supports event-images, archive, and research guides buckets
 * 
 * @param file - The file to upload
 * @param path - The path within the bucket (can include subfolders)
 * @param bucket - The bucket name (defaults to "archive")
 */
export async function uploadFile(
  file: File,
  path: string,
  bucket?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return {
        success: false,
        error: "Missing Supabase configuration",
      };
    }

    const supabase = createClient(url, anonKey);
    const bucketName = bucket || "archive";

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("[Storage] Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}
