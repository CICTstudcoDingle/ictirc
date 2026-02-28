import type { NextConfig } from "next";

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
    reactCompiler: true,
    optimizePackageImports: [
      "lucide-react",
      "@ictirc/ui",
    ],
  },

  transpilePackages: ["@ictirc/ui"],
};

export default nextConfig;
