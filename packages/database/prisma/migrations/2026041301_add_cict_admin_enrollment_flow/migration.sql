-- CICT Admin enrollment + cashier flow (production-safe additive migration)
-- Notes:
-- 1) This migration only adds objects/columns/defaults.
-- 2) No DROP, TRUNCATE, or destructive operation is used.

-- CreateEnum: CictAdminRole
DO $$ BEGIN
  CREATE TYPE "CictAdminRole" AS ENUM ('ADMIN', 'FACULTY', 'OFFICER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum: CictEnrollmentStatus
DO $$ BEGIN
  CREATE TYPE "CictEnrollmentStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'PAID', 'ENROLLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum: CictCashierPaymentStatus
DO $$ BEGIN
  CREATE TYPE "CictCashierPaymentStatus" AS ENUM ('POSTED', 'VOID');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum: CictCashierPaymentMethod
DO $$ BEGIN
  CREATE TYPE "CictCashierPaymentMethod" AS ENUM ('CASH');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum: CictStudentType
DO $$ BEGIN
  CREATE TYPE "CictStudentType" AS ENUM ('INCOMING', 'REGULAR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable: cict_admin_profiles
CREATE TABLE IF NOT EXISTS "cict_admin_profiles" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" "CictAdminRole" NOT NULL DEFAULT 'OFFICER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cict_admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_departments
CREATE TABLE IF NOT EXISTS "cict_departments" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cict_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_department_fees
CREATE TABLE IF NOT EXISTS "cict_department_fees" (
  "id" TEXT NOT NULL,
  "academicYear" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL DEFAULT 50,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "departmentId" TEXT NOT NULL,
  CONSTRAINT "cict_department_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_enrollments
CREATE TABLE IF NOT EXISTS "cict_enrollments" (
  "id" TEXT NOT NULL,
  "studentType" "CictStudentType" NOT NULL DEFAULT 'INCOMING',
  "studentName" TEXT NOT NULL,
  "studentNumber" TEXT NOT NULL,
  "program" TEXT NOT NULL,
  "yearLevel" INTEGER NOT NULL,
  "sectionName" TEXT,
  "departmentFee" DECIMAL(10,2) NOT NULL DEFAULT 50,
  "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "status" "CictEnrollmentStatus" NOT NULL DEFAULT 'SUBMITTED',
  "remarks" TEXT,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approvedAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "sectionAssignedAt" TIMESTAMP(3),
  "enrolledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "departmentId" TEXT NOT NULL,
  CONSTRAINT "cict_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_enrollment_status_history
CREATE TABLE IF NOT EXISTS "cict_enrollment_status_history" (
  "id" TEXT NOT NULL,
  "fromStatus" "CictEnrollmentStatus",
  "toStatus" "CictEnrollmentStatus" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "enrollmentId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  CONSTRAINT "cict_enrollment_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_cashier_payments
CREATE TABLE IF NOT EXISTS "cict_cashier_payments" (
  "id" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "method" "CictCashierPaymentMethod" NOT NULL DEFAULT 'CASH',
  "status" "CictCashierPaymentStatus" NOT NULL DEFAULT 'POSTED',
  "referenceNumber" TEXT NOT NULL,
  "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "enrollmentId" TEXT NOT NULL,
  "cashierId" TEXT NOT NULL,
  CONSTRAINT "cict_cashier_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_receipts
CREATE TABLE IF NOT EXISTS "cict_receipts" (
  "id" TEXT NOT NULL,
  "receiptNo" TEXT NOT NULL,
  "payerName" TEXT NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "remarks" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paymentId" TEXT NOT NULL,
  "issuedById" TEXT NOT NULL,
  CONSTRAINT "cict_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cict_audit_events
CREATE TABLE IF NOT EXISTS "cict_audit_events" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorId" TEXT NOT NULL,
  CONSTRAINT "cict_audit_events_pkey" PRIMARY KEY ("id")
);

-- Ensure columns/defaults when tables already exist
ALTER TABLE IF EXISTS "cict_department_fees" ALTER COLUMN "amount" SET DEFAULT 50;
ALTER TABLE IF EXISTS "cict_enrollments" ADD COLUMN IF NOT EXISTS "studentType" "CictStudentType" NOT NULL DEFAULT 'INCOMING';
ALTER TABLE IF EXISTS "cict_enrollments" ADD COLUMN IF NOT EXISTS "sectionName" TEXT;
ALTER TABLE IF EXISTS "cict_enrollments" ADD COLUMN IF NOT EXISTS "sectionAssignedAt" TIMESTAMP(3);
ALTER TABLE IF EXISTS "cict_enrollments" ALTER COLUMN "departmentFee" SET DEFAULT 50;

-- Indexes and uniques
CREATE UNIQUE INDEX IF NOT EXISTS "cict_admin_profiles_email_key" ON "cict_admin_profiles"("email");
CREATE INDEX IF NOT EXISTS "cict_admin_profiles_email_idx" ON "cict_admin_profiles"("email");
CREATE INDEX IF NOT EXISTS "cict_admin_profiles_role_idx" ON "cict_admin_profiles"("role");

CREATE UNIQUE INDEX IF NOT EXISTS "cict_departments_code_key" ON "cict_departments"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "cict_departments_name_key" ON "cict_departments"("name");
CREATE INDEX IF NOT EXISTS "cict_departments_isActive_idx" ON "cict_departments"("isActive");

CREATE UNIQUE INDEX IF NOT EXISTS "cict_department_fees_departmentId_academicYear_key" ON "cict_department_fees"("departmentId", "academicYear");
CREATE INDEX IF NOT EXISTS "cict_department_fees_academicYear_idx" ON "cict_department_fees"("academicYear");

CREATE INDEX IF NOT EXISTS "cict_enrollments_studentNumber_idx" ON "cict_enrollments"("studentNumber");
CREATE INDEX IF NOT EXISTS "cict_enrollments_studentType_idx" ON "cict_enrollments"("studentType");
CREATE INDEX IF NOT EXISTS "cict_enrollments_status_idx" ON "cict_enrollments"("status");
CREATE INDEX IF NOT EXISTS "cict_enrollments_departmentId_idx" ON "cict_enrollments"("departmentId");

CREATE INDEX IF NOT EXISTS "cict_enrollment_status_history_enrollmentId_idx" ON "cict_enrollment_status_history"("enrollmentId");
CREATE INDEX IF NOT EXISTS "cict_enrollment_status_history_actorId_idx" ON "cict_enrollment_status_history"("actorId");
CREATE INDEX IF NOT EXISTS "cict_enrollment_status_history_createdAt_idx" ON "cict_enrollment_status_history"("createdAt");

CREATE INDEX IF NOT EXISTS "cict_cashier_payments_enrollmentId_idx" ON "cict_cashier_payments"("enrollmentId");
CREATE INDEX IF NOT EXISTS "cict_cashier_payments_cashierId_idx" ON "cict_cashier_payments"("cashierId");
CREATE INDEX IF NOT EXISTS "cict_cashier_payments_postedAt_idx" ON "cict_cashier_payments"("postedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "cict_receipts_receiptNo_key" ON "cict_receipts"("receiptNo");
CREATE UNIQUE INDEX IF NOT EXISTS "cict_receipts_paymentId_key" ON "cict_receipts"("paymentId");
CREATE INDEX IF NOT EXISTS "cict_receipts_issuedAt_idx" ON "cict_receipts"("issuedAt");
CREATE INDEX IF NOT EXISTS "cict_receipts_issuedById_idx" ON "cict_receipts"("issuedById");

CREATE INDEX IF NOT EXISTS "cict_audit_events_actorId_idx" ON "cict_audit_events"("actorId");
CREATE INDEX IF NOT EXISTS "cict_audit_events_targetType_idx" ON "cict_audit_events"("targetType");
CREATE INDEX IF NOT EXISTS "cict_audit_events_targetId_idx" ON "cict_audit_events"("targetId");
CREATE INDEX IF NOT EXISTS "cict_audit_events_createdAt_idx" ON "cict_audit_events"("createdAt");

-- Foreign keys
DO $$ BEGIN
  ALTER TABLE "cict_department_fees"
  ADD CONSTRAINT "cict_department_fees_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "cict_departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_enrollments"
  ADD CONSTRAINT "cict_enrollments_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "cict_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_enrollment_status_history"
  ADD CONSTRAINT "cict_enrollment_status_history_enrollmentId_fkey"
  FOREIGN KEY ("enrollmentId") REFERENCES "cict_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_enrollment_status_history"
  ADD CONSTRAINT "cict_enrollment_status_history_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "cict_admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_cashier_payments"
  ADD CONSTRAINT "cict_cashier_payments_enrollmentId_fkey"
  FOREIGN KEY ("enrollmentId") REFERENCES "cict_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_cashier_payments"
  ADD CONSTRAINT "cict_cashier_payments_cashierId_fkey"
  FOREIGN KEY ("cashierId") REFERENCES "cict_admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_receipts"
  ADD CONSTRAINT "cict_receipts_paymentId_fkey"
  FOREIGN KEY ("paymentId") REFERENCES "cict_cashier_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_receipts"
  ADD CONSTRAINT "cict_receipts_issuedById_fkey"
  FOREIGN KEY ("issuedById") REFERENCES "cict_admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cict_audit_events"
  ADD CONSTRAINT "cict_audit_events_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "cict_admin_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
