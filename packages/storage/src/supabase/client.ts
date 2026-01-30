import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Storage Configuration
 */
export interface SupabaseStorageConfig {
  url: string;
  anonKey: string;
  bucketName: string;
}

/**
 * Get Supabase Storage configuration from environment variables
 */
export function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_HOT || "manuscripts";

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return {
    url,
    anonKey,
    bucketName,
  };
}

/**
 * Singleton Supabase Client for storage operations
 */
let _storageClient: SupabaseClient | null = null;

export function createStorageClient(): SupabaseClient {
  if (_storageClient) {
    return _storageClient;
  }

  const config = getSupabaseStorageConfig();

  _storageClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return _storageClient;
}
