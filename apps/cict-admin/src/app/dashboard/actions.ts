"use server";

import {
  prisma,
  CictAdminRole,
  CictEnrollmentStatus,
  CictCashierPaymentMethod,
} from "@ictirc/database";
import { revalidatePath } from "next/cache";
import { requireCictAccess } from "@/lib/auth";

function toNumber(value: FormDataEntryValue | null): number {
  return Number(value || 0);
}

function buildReceiptNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `RCP-${y}${m}${d}-${rand}`;
}

const FIXED_DEPARTMENT_FEE = 50;

function isValidStatusTransition(fromStatus: CictEnrollmentStatus, toStatus: CictEnrollmentStatus) {
  const allowed: Record<CictEnrollmentStatus, CictEnrollmentStatus[]> = {
    SUBMITTED: ["APPROVED", "REJECTED"],
    APPROVED: ["REJECTED"],
    REJECTED: [],
    PAID: ["ENROLLED"],
    ENROLLED: [],
  };

  return allowed[fromStatus].includes(toStatus);
}

export async function createDepartmentWithFeeAction(formData: FormData) {
  await requireCictAccess(["ADMIN", "FACULTY"] as CictAdminRole[]);

  const code = String(formData.get("code") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const academicYear = String(formData.get("academicYear") || "").trim();

  if (!code || !name || !academicYear) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const department = await tx.cictDepartment.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    });

    await tx.cictDepartmentFee.upsert({
      where: {
        departmentId_academicYear: {
          departmentId: department.id,
          academicYear,
        },
      },
      update: { amount: FIXED_DEPARTMENT_FEE },
      create: {
        departmentId: department.id,
        academicYear,
        amount: FIXED_DEPARTMENT_FEE,
      },
    });
  });

  revalidatePath("/dashboard/enrollments");
}

export async function createEnrollmentAction(formData: FormData) {
  const { profile } = await requireCictAccess(["ADMIN", "FACULTY", "OFFICER"] as CictAdminRole[]);

  const studentName = String(formData.get("studentName") || "").trim();
  const studentNumber = String(formData.get("studentNumber") || "").trim();
  const program = String(formData.get("program") || "").trim();
  const yearLevel = toNumber(formData.get("yearLevel"));
  const departmentId = String(formData.get("departmentId") || "").trim();
  const academicYear = String(formData.get("academicYear") || "").trim();
  const remarks = String(formData.get("remarks") || "").trim() || null;

  if (!studentName || !studentNumber || !program || !yearLevel || !departmentId || !academicYear) {
    return;
  }

  await prisma.cictDepartmentFee.upsert({
    where: {
      departmentId_academicYear: {
        departmentId,
        academicYear,
      },
    },
    update: { amount: FIXED_DEPARTMENT_FEE },
    create: {
      departmentId,
      academicYear,
      amount: FIXED_DEPARTMENT_FEE,
    },
  });

  const enrollment = await prisma.cictEnrollment.create({
    data: {
      studentType: "INCOMING",
      studentName,
      studentNumber,
      program,
      yearLevel,
      departmentId,
      departmentFee: FIXED_DEPARTMENT_FEE,
      remarks,
    },
  });

  await prisma.cictEnrollmentStatusHistory.create({
    data: {
      enrollmentId: enrollment.id,
      toStatus: "SUBMITTED",
      actorId: profile.id,
      note: "Enrollment submitted",
    },
  });

  await prisma.cictAuditEvent.create({
    data: {
      actorId: profile.id,
      action: "ENROLLMENT_CREATED",
      targetType: "CictEnrollment",
      targetId: enrollment.id,
      metadata: { studentNumber },
    },
  });

  revalidatePath("/dashboard/enrollments");
}

export async function updateEnrollmentStatusAction(formData: FormData) {
  const { profile } = await requireCictAccess(["ADMIN", "FACULTY"] as CictAdminRole[]);

  const enrollmentId = String(formData.get("enrollmentId") || "").trim();
  const status = String(formData.get("status") || "").trim() as CictEnrollmentStatus;
  const sectionName = String(formData.get("sectionName") || "").trim() || null;
  const note = String(formData.get("note") || "").trim() || null;

  if (!enrollmentId || !status) {
    return;
  }

  const existing = await prisma.cictEnrollment.findUnique({ where: { id: enrollmentId } });
  if (!existing) {
    return;
  }

  if (!isValidStatusTransition(existing.status, status)) {
    return;
  }

  if (status === "ENROLLED") {
    if (existing.status !== "PAID") {
      return;
    }

    if (Number(existing.paidAmount) < Number(existing.departmentFee)) {
      return;
    }
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.cictEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        approvedAt: status === "APPROVED" ? now : existing.approvedAt,
        sectionName: status === "ENROLLED" ? sectionName : existing.sectionName,
        sectionAssignedAt: status === "ENROLLED" && sectionName ? now : existing.sectionAssignedAt,
        enrolledAt: status === "ENROLLED" ? now : existing.enrolledAt,
      },
    });

    await tx.cictEnrollmentStatusHistory.create({
      data: {
        enrollmentId,
        fromStatus: existing.status,
        toStatus: status,
        actorId: profile.id,
        note,
      },
    });

    await tx.cictAuditEvent.create({
      data: {
        actorId: profile.id,
        action: "ENROLLMENT_STATUS_UPDATED",
        targetType: "CictEnrollment",
        targetId: enrollmentId,
        metadata: { from: existing.status, to: status },
      },
    });
  });

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/dashboard/cashier");
}

export async function postCashierPaymentAction(formData: FormData) {
  const { profile } = await requireCictAccess(["ADMIN", "OFFICER"] as CictAdminRole[]);

  const enrollmentId = String(formData.get("enrollmentId") || "").trim();
  const referenceNumber = String(formData.get("referenceNumber") || "").trim();
  const remarks = String(formData.get("remarks") || "").trim() || null;

  if (!enrollmentId || !referenceNumber) {
    return;
  }

  const enrollment = await prisma.cictEnrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.status !== "APPROVED") {
    return;
  }

  const requiredAmount = Number(enrollment.departmentFee) - Number(enrollment.paidAmount);
  if (requiredAmount !== FIXED_DEPARTMENT_FEE) {
    return;
  }

  const amount = requiredAmount;

  const receiptNo = buildReceiptNo();
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const payment = await tx.cictCashierPayment.create({
      data: {
        enrollmentId,
        amount,
        method: CictCashierPaymentMethod.CASH,
        referenceNumber,
        cashierId: profile.id,
      },
    });

    await tx.cictReceipt.create({
      data: {
        paymentId: payment.id,
        receiptNo,
        payerName: enrollment.studentName,
        issuedById: profile.id,
        remarks,
      },
    });

    await tx.cictEnrollment.update({
      where: { id: enrollmentId },
      data: {
        paidAmount: {
          increment: amount,
        },
        status: "PAID",
        paidAt: now,
      },
    });

    await tx.cictEnrollmentStatusHistory.create({
      data: {
        enrollmentId,
        fromStatus: enrollment.status,
        toStatus: "PAID",
        actorId: profile.id,
        note: "Manual cashier payment posted",
      },
    });

    await tx.cictAuditEvent.create({
      data: {
        actorId: profile.id,
        action: "PAYMENT_POSTED",
        targetType: "CictEnrollment",
        targetId: enrollmentId,
        metadata: { amount, referenceNumber, receiptNo },
      },
    });
  });

  revalidatePath("/dashboard/cashier");
  revalidatePath("/dashboard/receipts");
  revalidatePath("/dashboard/enrollments");
}
