import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Storage Configuration
 */
export interface SupabaseStorageConfig {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
  bucketName: string;
}

/**
 * Get Supabase Storage configuration from environment variables.
 * Uses service_role key for server-side uploads (bypasses RLS).
 */
export function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Service role key is NEVER exposed publicly - server-side only
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_HOT || "manuscripts";

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required for server-side file uploads."
    );
  }

  return {
    url,
    serviceRoleKey,
    anonKey,
    bucketName,
  };
}

/**
 * Singleton Supabase Admin Client for SERVER-SIDE storage operations.
 * Uses the service_role key to bypass RLS — ONLY use in Server Actions / API routes.
 */
let _storageAdminClient: SupabaseClient | null = null;

export function createStorageClient(): SupabaseClient {
  if (_storageAdminClient) {
    return _storageAdminClient;
  }

  const config = getSupabaseStorageConfig();

  // Use service_role key for server-side uploads.
  // This bypasses Row Level Security and allows writes to private buckets.
  _storageAdminClient = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _storageAdminClient;
}
