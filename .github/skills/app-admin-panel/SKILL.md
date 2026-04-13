---
name: app-admin-panel
description: "Build and maintain admin-facing workflows in apps/admin with role-aware actions, moderation states, and package-based integrations (database, search, storage)."
argument-hint: "Admin feature, actor role, and desired workflow"
user-invocable: true
---
# Admin Panel Workflow

## When to Use
- Building new admin capabilities in `apps/admin`.
- Extending moderation, approvals, data management, or operational dashboards.
- Implementing role-aware actions for dean/editor/reviewer staff.

## Procedure
1. Confirm actor roles and authorization boundaries.
2. Map the state transitions for the admin workflow.
3. Identify data dependencies in `@ictirc/database`.
4. Implement server-first actions and validate permissions before UI wiring.
5. Add/update admin UI using shared components from `@ictirc/ui`.
6. Validate with lint/typecheck and happy-path role checks.

## Clarifications to Ask First
- Which roles can view, create, edit, approve, reject, refund, or archive?
- Which records are immutable vs editable?
- What should be auditable and how long should logs be retained?
- What is the expected fallback behavior on integration failure (search/storage/payment)?

## Integration Notes
- Data model source of truth: `packages/database/prisma/schema.prisma`
- Search workflows: `@ictirc/search`
- File workflows: `@ictirc/storage`
- Security checks can follow patterns in `apps/admin/middleware.ts`
