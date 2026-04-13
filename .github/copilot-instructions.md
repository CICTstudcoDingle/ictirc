# ICTIRC Workspace Instructions

## Code Style
- Follow existing TypeScript + Next.js app-router patterns already used in each app under `apps/*`.
- Reuse workspace packages via `@ictirc/*` imports instead of duplicating logic in apps.
- Keep changes scoped to the target app/package; avoid broad refactors unless requested.
- Prefer existing lint/typecheck rules from `@ictirc/config` and each app's `tsconfig.json`.

## Architecture
- Monorepo uses `pnpm` workspaces and Turborepo.
- `apps/*` are deployable Next.js applications.
- `packages/*` are shared libraries (`database`, `ui`, `search`, `storage`, `seo`, etc.).
- Put shared domain logic in packages when it will be reused by multiple apps.
- For data features, use `@ictirc/database` (Prisma) as the source of truth for schema and generated types.

## Build and Test
- Install dependencies: `pnpm install`
- Run all apps/packages in dev mode: `pnpm dev`
- Build monorepo: `pnpm build`
- Lint monorepo: `pnpm lint`
- Typecheck monorepo: `pnpm typecheck`
- Regenerate Prisma client: `pnpm --filter @ictirc/database run db:generate`

## Conventions
- Root scripts are orchestrated by `turbo.json`; respect task dependencies.
- CICT app local dev command is `pnpm --filter @ictirc/cict dev` (port 3002).
- Admin app local dev command is `pnpm --filter @ictirc/admin dev` (port 3001).
- Ask for clarification before implementing when requirements, data ownership, payment flows, or role permissions are ambiguous.
- For new features touching DB + UI + business rules, propose a phased plan first (schema, API/actions, UI, tests, rollout).

## Pitfalls
- Prisma types may appear stale until `db:generate` is run after schema changes.
- Next.js canary versions may surface framework-specific build issues; verify whether failures are app code or framework regressions.
- Multi-app local development can hit port conflicts; confirm target app command and port before running.

## Existing Documentation (Link, Do Not Duplicate)
- `README.md`
- `IMPLEMENTATION_STATUS.md`
- `ERRORS_RESOLVED.md`
- `ALGOLIA_IMPLEMENTATION_PLAN.md`
- `README_ARCHIVE_SYSTEM.md`
- `packages/storage/README.md`
- `docs/google-service-account-setup.md`
