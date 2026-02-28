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
    // Enable Partial Prerendering when stable
    // ppr: true,

    // Support large file uploads (50MB) for manuscript submissions
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/seo",
    "@ictirc/email",
    "@ictirc/search",
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
  async headers() {
    return [
      {
        // Fix: browsers require application/manifest+json MIME type for PWA manifests.
        // Without this, Chrome rejects the fetch with error code 441.
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
