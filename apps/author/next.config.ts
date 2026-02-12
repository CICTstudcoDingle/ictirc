import type { NextConfig } from "next";
import { execSync } from "child_process";

// Get git commit hash at build time
let gitCommitHash = "dev";
try {
  gitCommitHash = execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (error) {
  console.warn("Could not retrieve git commit hash:", error);
}

const nextConfig: NextConfig = {
  experimental: {
    // Support large file uploads (50MB) for manuscript submissions
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/submission-form",
    "@ictirc/storage",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lydwljxqxjucpixkyjzp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: gitCommitHash,
  },
};

export default nextConfig;
