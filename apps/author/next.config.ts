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
  // ── Performance / INP Optimizations ──────────────────────────────────────
  poweredByHeader: false,
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  experimental: {
    // React Compiler — automatic memoization, reduces re-renders that cause INP spikes
    reactCompiler: true,

    // Tree-shake icon/UI libs so only used exports are bundled
    optimizePackageImports: [
      "lucide-react",
      "@ictirc/ui",
      "@ictirc/submission-form",
    ],

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
    // Prefer AVIF then WebP for faster rendering
    formats: ["image/avif", "image/webp"],
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
