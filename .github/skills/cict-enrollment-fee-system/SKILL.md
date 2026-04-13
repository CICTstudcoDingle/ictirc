---
name: cict-enrollment-fee-system
description: "Plan and implement the cict expansion: cict admin area, database integration, enrollment workflow, and department fee payment lifecycle. Use for requirements clarification, schema-first design, and staged delivery."
argument-hint: "Program scope, departments, fee rules, and payment provider"
user-invocable: true
---
# CICT Enrollment and Department Fee System

## Goal
Deliver a staged implementation for:
- Admin capability for `apps/cict`.
- Database-backed enrollment records.
- Department fee assessment and payment workflows.

## Clarification-First Rules
Before implementation, ask and confirm:
1. Which app hosts admin UX: `apps/cict`, `apps/admin`, or both?
2. Who are system actors (student, cashier, department admin, college admin)?
3. Which payment provider(s) are required (manual, online gateway, mixed)?
4. Is payment approval automatic or manually reconciled?
5. What is the enrollment state machine (draft, submitted, verified, paid, enrolled, cancelled)?
6. Are partial payments, installment plans, waivers, or penalties required?
7. What are receipt, ledger, refund, and audit requirements?

## Delivery Phases
1. Domain and policy definition
   - Finalize actors, fee policy, and lifecycle states.
   - Define acceptance criteria per workflow.
2. Schema design in `@ictirc/database`
   - Add entities for term, department, enrollment, fee schedule, invoice, payment, receipt, and audit event.
   - Add enums for status lifecycles and payment methods.
   - Regenerate Prisma client.
3. Service layer and server actions
   - Create role-checked actions for enrollment submission, fee computation, payment posting, and verification.
   - Enforce idempotency for payment callbacks and reconciliation.
4. Admin and student UI
   - Enrollment application and status tracking screens.
   - Admin queue for verification, approvals, and payment reconciliation.
   - Receipt and transaction detail pages.
5. Validation and rollout
   - Typecheck/lint/build.
   - Seed demo data and test core scenarios.
   - Link rollout notes to existing project docs.

## Suggested Initial Data Model (Adjust After Clarification)
- `Department`
- `AcademicTerm`
- `EnrollmentApplication`
- `EnrollmentStatusHistory`
- `DepartmentFeeSchedule`
- `Invoice`
- `InvoiceLineItem`
- `PaymentTransaction`
- `PaymentAllocation`
- `Receipt`
- `AuditLog`

## Risk Controls
- Keep fee calculation deterministic and versioned by term.
- Store payment gateway references and reconciliation status separately from enrollment status.
- Require audit entries for approval, rejection, payment posting, refund, and fee override actions.
- Never hard-delete financial transactions; use reversal records.

## Validation Checklist
- Prisma schema generated and types updated.
- Role permissions verified on all mutating actions.
- Enrollment and payment states cannot move to invalid transitions.
- Receipts and ledger views reconcile to transaction totals.
