import { prisma } from "@ictirc/database";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export const metadata = { title: "Cashier — Enrollment" };

export default async function CashierPage() {
  let approved: Awaited<ReturnType<typeof prisma.cictEnrollment.findMany>> = [];

  try {
    approved = await prisma.cictEnrollment.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    // DB not set up
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/enrollment"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cashier — Payment Posting</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {approved.length} student{approved.length !== 1 ? "s" : ""} awaiting payment.
            Payments are recorded in the cict-admin system.
          </p>
        </div>
      </div>

      {approved.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 shadow-sm">
          <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">No approved enrollments awaiting payment.</p>
          <p className="text-xs mt-2">Approved students are sent to the cict-admin cashier for payment posting.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approved.map((enrollment) => (
            <div key={enrollment.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="border-l-4 border-maroon px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{enrollment.studentName}</p>
                    <div className="text-xs text-gray-400 font-mono mt-0.5 flex gap-3">
                      <span>{enrollment.program}</span>
                      <span>Year {enrollment.yearLevel}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-400">Department Fee</p>
                    <p className="text-lg font-bold text-maroon font-mono">
                      ₱{Number(enrollment.departmentFee).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-700">
                💡 To post payment, use the{" "}
                <a
                  href="https://ictirc-cict-admin.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  CICT Admin cashier
                </a>{" "}
                until full migration is complete.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
