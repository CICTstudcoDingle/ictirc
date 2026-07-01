/**
 * Feature flags derived from environment variables.
 *
 * These are checked at runtime so the UI can degrade gracefully when a
 * third-party service is not configured.
 */

export function isCloudConvertConfigured(): boolean {
  return !!process.env.CLOUDCONVERT_API_KEY;
}

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

export function isAlgoliaConfigured(): boolean {
  return !!(process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_API_KEY);
}

export function isGoogleDriveConfigured(): boolean {
  return !!(
    process.env.GDRIVE_SERVICE_EMAIL &&
    process.env.GDRIVE_PRIVATE_KEY &&
    process.env.GDRIVE_BACKUP_FOLDER_ID
  );
}

export function isSupabaseStorageConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_BUCKET_HOT
  );
}

export interface ServiceStatus {
  name: string;
  configured: boolean;
  requiredVars: string[];
}

/**
 * Returns a list of all external services and whether they are configured.
 */
export function getServiceStatuses(): ServiceStatus[] {
  return [
    {
      name: "CloudConvert (DOCX → PDF)",
      configured: isCloudConvertConfigured(),
      requiredVars: ["CLOUDCONVERT_API_KEY"],
    },
    {
      name: "Cloudflare R2 (cold storage / videos)",
      configured: isR2Configured(),
      requiredVars: [
        "R2_ACCOUNT_ID",
        "R2_ACCESS_KEY_ID",
        "R2_SECRET_ACCESS_KEY",
        "R2_BUCKET_NAME_COLD",
      ],
    },
    {
      name: "Algolia (search management)",
      configured: isAlgoliaConfigured(),
      requiredVars: [
        "ALGOLIA_APP_ID",
        "ALGOLIA_ADMIN_API_KEY",
        "NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY",
      ],
    },
    {
      name: "Google Drive (backup uploads)",
      configured: isGoogleDriveConfigured(),
      requiredVars: [
        "GDRIVE_SERVICE_EMAIL",
        "GDRIVE_PRIVATE_KEY",
        "GDRIVE_BACKUP_FOLDER_ID",
      ],
    },
    {
      name: "Supabase Storage (paper PDF uploads)",
      configured: isSupabaseStorageConfigured(),
      requiredVars: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "NEXT_PUBLIC_SUPABASE_BUCKET_HOT",
      ],
    },
  ];
}
