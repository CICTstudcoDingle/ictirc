---
trigger: always_on
---

⚡ JEFFDEV MONOREPO - TECH STACK CONSTITUTION (V1.0)
Directive: "Bleeding Edge, but Bulletproof." Enforcement: pnpm only. npm and yarn are banned via .npmrc. Synchronization: syncpack is the law. Versions must match across all apps.

1. THE CORE ENGINE (BLEEDING EDGE)
Framework: Next.js 16 (Canary)

Rule: Use next@canary to access latest Server Actions & RSC features.

Flag: Enable experimental.ppr (Partial Prerendering) in next.config.js.

Library: React 19 (RC/Beta)

Mandate: Must use the react@rc and react-dom@rc to support the Next.js 16 compiler.

Language: TypeScript 5.x

Strictness: strict: true is non-negotiable in tsconfig.json.

No Any: usage of any triggers a build failure. Use unknown or Zod schemas.

2. THE PACKAGE MANAGER (PNPM)
Engine: pnpm (Performant NPM).

Workspace Protocol: Internal packages must use the workspace:* protocol.

Correct: "@jeffdev/ui": "workspace:*"

Incorrect: "@jeffdev/ui": "1.0.0"

Engine Strictness (.npmrc):

Ini, TOML
engine-strict=true
auto-install-peers=true
public-hoist-pattern[]=*types*
public-hoist-pattern[]=*eslint*
node-linker=hoisted
3. DEPENDENCY GOVERNANCE (SYNCPACK)
The Law: "One Version to Rule Them All." You cannot have react@19.0.1 in apps/web and react@18.2 in apps/admin.

A. Configuration (.syncpackrc.json)
Place this at the root. It enforces exact version matching and prioritizes local workspace packages.

JSON
{
  "dependencyTypes": ["dev", "prod", "peer", "overrides"],
  "source": ["package.json", "apps/*/package.json", "packages/*/package.json"],
  "indent": "  ",
  "versionGroups": [
    {
      "label": "Internal Workspace Packages",
      "packages": ["**"],
      "dependencies": ["@jeffdev/**"],
      "dependencyTypes": ["dev", "prod"],
      "pinVersion": "workspace:*"
    },
    {
      "label": "React Core (Enforce RC)",
      "packages": ["**"],
      "dependencies": ["react", "react-dom"],
      "pinVersion": "19.0.0-rc-*"
    },
    {
      "label": "Global External Consistency",
      "dependencies": ["**"],
      "packages": ["**"],
      "dependencyTypes": ["dev", "prod"],
      "isIgnored": false
    }
  ],
  "semverGroups": [
    {
      "range": "",
      "dependencies": ["**"],
      "packages": ["**"]
    }
  ]
}
B. Audit Workflow
Check Command: pnpm syncpack list-mismatches (Runs in CI).

Fix Command: pnpm syncpack fix-mismatches (Runs locally before commit).

4. DATA & INFRASTRUCTURE STACK
Database: PostgreSQL (Supabase/Neon).

ORM: Prisma 6.x (Latest).

Driver: Use @prisma/adapter-pg for Serverless environments.

Storage: AWS SDK v3 (@aws-sdk/client-s3) targeted at Cloudflare R2.

Auth: Supabase Auth (@supabase/ssr).

Validation: Zod 3.x.

5. UI & STYLING STACK
Engine: Tailwind CSS v4.0 (Alpha/Beta).

Reasoning: Native CSS variables, rust-based compiler for speed.

Components: Headless UI + Radix UI primitives.

Icons: Lucide React (lucide-react).

Animation: Framer Motion (essential for the "Stealth" feel).