import { requireCictAccess } from "@/lib/auth";
import { prisma } from "@ictirc/database";
import { postCashierPaymentAction } from "../actions";

type EnrollmentRecord = Awaited<ReturnType<typeof prisma.cictEnrollment.findMany>>[number];

export default async function CashierPage() {
  await requireCictAccess(["ADMIN", "OFFICER"]);

  const enrollments = (await prisma.cictEnrollment.findMany({
    where: { status: "APPROVED" },
    include: { department: true },
    orderBy: { approvedAt: "desc" },
    take: 50,
  })) as EnrollmentRecord[];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-maroon">Manual Cashier Posting</h1>
        <p className="mt-1 text-sm text-gray-600">Only approved incoming enrollments can be posted. Department fee is fixed at PHP 50.</p>
      </div>

      <form action={postCashierPaymentAction} className="panel p-5 space-y-3">
        <h2 className="text-lg font-semibold">Post Payment</h2>

        <select name="enrollmentId" className="input" aria-label="Select approved enrollment" required>
          <option value="">Select approved enrollment</option>
          {enrollments.map((enrollment: EnrollmentRecord) => {
            const remaining = Number(enrollment.departmentFee) - Number(enrollment.paidAmount);
            return (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.studentName} ({enrollment.studentNumber}) - PHP {remaining.toFixed(2)}
              </option>
            );
          })}
        </select>

        <div className="grid gap-3 sm:grid-cols-2">
          <input value="PHP 50.00 (fixed)" className="input bg-gray-100" aria-label="Fixed department fee" readOnly />
          <input name="referenceNumber" placeholder="Cashier reference number" className="input" required />
        </div>

        <textarea name="remarks" className="input" rows={3} placeholder="Receipt remarks (optional)" />

        <button type="submit" className="btn-primary">Post Payment and Issue Receipt</button>
      </form>
    </section>
  );
}
