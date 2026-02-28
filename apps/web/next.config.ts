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

  // Strip console.log in production builds (keeps errors/warnings)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  experimental: {
    // React Compiler — automatic memoization of components & hooks.
    // Eliminates manual useMemo/useCallback, drastically reduces INP-causing re-renders.
    reactCompiler: true,

    // Tree-shake heavy packages at import time so only used icons/components are bundled.
    // This reduces the JS parse+evaluation cost that blocks the main thread (INP).
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@ictirc/ui",
      "@studio-freight/lenis",
    ],

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
    // Prefer AVIF then WebP — smaller payloads decode faster, reducing LCP and INP delay
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
  async headers() {
    return [
      {
        // Immutable cache for hashed Next.js static assets (JS chunks, CSS, fonts).
        // Browser won't even make a network request for these — zero latency on repeat visits.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none';",
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
