import { prisma } from "@ictirc/database";
import { requireCictAccess } from "@/lib/auth";

export default async function DashboardPage() {
  await requireCictAccess();

  const [enrollmentCount, approvedCount, paidCount, receiptCount] = await Promise.all([
    prisma.cictEnrollment.count(),
    prisma.cictEnrollment.count({ where: { status: "APPROVED" } }),
    prisma.cictEnrollment.count({ where: { status: "PAID" } }),
    prisma.cictReceipt.count(),
  ]);

  return (
    <section className="space-y-6">
      {/* Deprecation Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-amber-500 text-lg shrink-0">⚠️</span>
        <div className="text-sm">
          <p className="font-semibold text-amber-800">
            This admin panel is deprecated.
          </p>
          <p className="text-amber-700 mt-0.5">
            Enrollment management has been migrated to the{" "}
            <a
              href={process.env.NEXT_PUBLIC_PORTAL_ADMIN_URL || "https://portal-admin.isufstcict.com"}
              className="font-medium underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portal Admin Dashboard
            </a>. This site will remain accessible for legacy cashier operations only.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-maroon">CICT Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manual cashier and enrollment management for Admin, Faculty, and Officers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-5">
          <p className="text-sm text-gray-500">Total Enrollments</p>
          <p className="mt-2 text-3xl font-bold">{enrollmentCount}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="mt-2 text-3xl font-bold">{approvedCount}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="mt-2 text-3xl font-bold">{paidCount}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-gray-500">Receipts Issued</p>
          <p className="mt-2 text-3xl font-bold">{receiptCount}</p>
        </div>
      </div>
    </section>
  );
}
