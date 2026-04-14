"use server";

import { prisma, CictEnrollmentStatus } from "@ictirc/database";
import { revalidatePath } from "next/cache";

function isValidStatusTransition(
  fromStatus: CictEnrollmentStatus,
  toStatus: CictEnrollmentStatus
) {
  const allowed: Record<CictEnrollmentStatus, CictEnrollmentStatus[]> = {
    SUBMITTED: ["APPROVED", "REJECTED"],
    APPROVED: ["REJECTED"],
    REJECTED: [],
    PAID: ["ENROLLED"],
    ENROLLED: [],
  };
  return allowed[fromStatus].includes(toStatus);
}

export async function updateEnrollmentStatusAction(formData: FormData) {
  const enrollmentId = String(formData.get("enrollmentId") || "").trim();
  const newStatus = String(formData.get("newStatus") || "").trim() as CictEnrollmentStatus;
  const section = String(formData.get("section") || "").trim();

  if (!enrollmentId || !newStatus) return;

  const enrollment = await prisma.cictEnrollment.findUnique({
    where: { id: enrollmentId },
  });
  if (!enrollment) return;
  if (!isValidStatusTransition(enrollment.status, newStatus)) return;

  const timestamps: Partial<{
    approvedAt: Date;
    paidAt: Date;
    sectionAssignedAt: Date;
    enrolledAt: Date;
  }> = {};

  if (newStatus === "APPROVED") timestamps.approvedAt = new Date();
  if (newStatus === "PAID") timestamps.paidAt = new Date();
  if (newStatus === "ENROLLED") {
    timestamps.enrolledAt = new Date();
    if (section) timestamps.sectionAssignedAt = new Date();
  }

  await prisma.cictEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: newStatus,
      ...(section && newStatus === "ENROLLED" ? { sectionName: section } : {}),
      ...timestamps,
    },
  });

  revalidatePath("/dashboard/enrollment");
}
