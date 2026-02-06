import { S3Client } from "@aws-sdk/client-s3";

/**
 * R2 Configuration from environment variables
 */
export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
}

/**
 * Get R2 configuration from environment variables
 * Validates that all required variables are present
 */
export function getR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME_COLD || "ictirc";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 configuration. Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
}

/**
 * Singleton R2 Client instance
 * Uses Cloudflare R2's S3-compatible API
 */
let _r2Client: S3Client | null = null;

export function r2Client(): S3Client {
  if (_r2Client) {
    return _r2Client;
  }

  const config = getR2Config();

  _r2Client = new S3Client({
    region: "auto", // R2 uses "auto" region
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return _r2Client;
}
