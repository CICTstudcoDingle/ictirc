---
name: apps-monorepo-delivery
description: "Plan and implement features in ICTIRC apps under apps/* using shared packages, Turbo tasks, and pnpm filters. Use for app selection, phased delivery, and safe cross-package changes."
argument-hint: "Target app, feature goal, constraints, and deadline"
user-invocable: true
---
# Apps Monorepo Delivery

## When to Use
- Adding or changing features in any app under `apps/*`.
- Coordinating app changes with shared packages under `packages/*`.
- Breaking work into safe phases before implementation.

## Procedure
1. Confirm target app(s) and expected outcomes.
2. Confirm whether logic belongs in app code or a shared package.
3. Define a phased plan before coding:
   - Phase 1: schema/contracts
   - Phase 2: server actions or API route handlers
   - Phase 3: UI and forms
   - Phase 4: tests, typecheck, lint
   - Phase 5: rollout notes and docs links
4. Implement in the smallest possible scope.
5. Validate with app-level and monorepo-level checks.

## Commands
- Install dependencies: `pnpm install`
- Dev all: `pnpm dev`
- Build all: `pnpm build`
- Lint all: `pnpm lint`
- Typecheck all: `pnpm typecheck`
- App dev: `pnpm --filter @ictirc/<app-name> dev`
- Prisma generate: `pnpm --filter @ictirc/database run db:generate`

## Guardrails
- Prefer `@ictirc/*` workspace imports over duplicated app logic.
- Keep changes isolated to the relevant app/package unless cross-app reuse is intended.
- For DB changes, update Prisma schema first, regenerate client, then wire app code.
- Link existing docs instead of duplicating long guidance.
