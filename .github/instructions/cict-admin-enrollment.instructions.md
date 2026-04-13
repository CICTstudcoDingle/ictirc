---
name: CICT Admin Enrollment and Cashier Rules
description: "Use when implementing cict-admin, enrollment workflow, cashier payment posting, receipt issuance, or related Prisma schema/actions. Keeps the scope simple and admin-only."
applyTo:
  - "apps/cict-admin/**"
  - "packages/database/prisma/**"
  - "packages/database/src/**"
---
# CICT Admin Enrollment and Cashier Implementation Rules

## Scope Lock
- Build and use a dedicated app: `apps/cict-admin`.
- Do not place this workflow in `apps/cict` or `apps/admin` unless explicitly requested later.
- Preserve the visual direction of the public CICT website, but adapt layout to sidebar navigation for admin workflows.

## Actors and Permissions
- Supported roles in this feature scope: Admin, Faculty, Officers.
- Enforce role checks on every mutating server action.
- Keep permission design simple and explicit; avoid complex inheritance in v1.

## Payment and Receipt Rules (v1)
- Payment processing is manual cashier only.
- No online payment gateway integration in v1.
- Support receipt issuance for each accepted payment.
- Keep receipt content minimal and practical (payer, date, amount, reference, cashier).

## Explicitly Out of Scope (v1)
- No partial payments.
- No installment plans.
- No refunds/reversals workflows.
- No advanced reconciliation pipelines.

## Data and Workflow Rules
- Use `@ictirc/database` as the source of truth for schema and generated types.
- Define clear and small state transitions for enrollment and payment status.
- Store payment posting and receipt issuance records as auditable events.
- Keep lifecycle simple and deterministic; avoid optional branches unless required.

## Delivery Sequence
1. Create `apps/cict-admin` shell with sidebar navigation and inherited visual language.
2. Define/adjust Prisma schema for enrollment, cashier posting, and receipts.
3. Regenerate Prisma client before wiring actions.
4. Implement server actions with role checks.
5. Implement UI forms/tables for enrollment queue, cashier posting, and receipts.
6. Run lint/typecheck and verify role-restricted flows.

## Validation Checklist
- `apps/cict-admin` exists and runs.
- Sidebar-based admin navigation is implemented.
- Admin, Faculty, and Officers permissions are enforced.
- Manual cashier posting works and issues receipt records.
- No partial/installment/refund logic exists in v1 paths.
