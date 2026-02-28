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
    // React Compiler — automatic memoization, reduces re-renders that cause INP spikes
    reactCompiler: true,

    // Tree-shake icon/UI libs so only used exports are bundled
    optimizePackageImports: [
      "lucide-react",
      "@ictirc/ui",
    ],

    // Support server actions for admin operations
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/storage",
    "@ictirc/email",
    "@ictirc/search",
  ],
};

export default nextConfig;
