import { prisma } from "@ictirc/database";
import Link from "next/link";
import { GraduationCap, Clock, CheckCircle, XCircle, CreditCard, ChevronRight } from "lucide-react";
import { updateEnrollmentStatusAction } from "./actions";

export const metadata = { title: "Enrollment Queue" };

const statusStyles: Record<string, { label: string; className: string }> = {
  SUBMITTED: { label: "Submitted", className: "bg-blue-50 text-blue-700" },
  APPROVED: { label: "Approved", className: "bg-green-50 text-green-700" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700" },
  PAID: { label: "Paid", className: "bg-purple-50 text-purple-700" },
  ENROLLED: { label: "Enrolled", className: "bg-emerald-50 text-emerald-700" },
};

export default async function EnrollmentQueuePage() {
  let enrollments: Awaited<ReturnType<typeof prisma.cictEnrollment.findMany>> = [];

  try {
    enrollments = await prisma.cictEnrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { department: true },
    });
  } catch {
    // DB not yet set up
  }

  const counts = {
    total: enrollments.length,
    submitted: enrollments.filter((e) => e.status === "SUBMITTED").length,
    approved: enrollments.filter((e) => e.status === "APPROVED").length,
    enrolled: enrollments.filter((e) => e.status === "ENROLLED").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment Queue</h1>
          <p className="text-sm text-gray-500 mt-1">{counts.total} total submissions</p>
        </div>
        <Link
          href="/dashboard/enrollment/cashier"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Cashier
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: counts.total, color: "border-gray-200" },
          { label: "Pending", value: counts.submitted, color: "border-blue-200" },
          { label: "Approved", value: counts.approved, color: "border-green-200" },
          { label: "Enrolled", value: counts.enrolled, color: "border-emerald-200" },
        ].map((s) => (
          <div key={s.label} className={`bg-white border ${s.color} rounded-xl p-4 shadow-sm`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No enrollments yet.</p>
            <p className="text-xs mt-1">Submissions from cict-admin will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {enrollments.map((enrollment) => {
              const s = statusStyles[enrollment.status] ?? statusStyles["SUBMITTED"];
              return (
                <div key={enrollment.id} className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-gray-50/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{enrollment.studentName}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 font-mono">
                      <span>{enrollment.program}</span>
                      <span>Year {enrollment.yearLevel}</span>
                      {enrollment.sectionName && <span>§ {enrollment.sectionName}</span>}
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.className}`}>
                    {s.label}
                  </span>

                  {/* Approve/Reject */}
                  {enrollment.status === "SUBMITTED" && (
                    <>
                      <form action={updateEnrollmentStatusAction}>
                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                        <input type="hidden" name="newStatus" value="APPROVED" />
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={updateEnrollmentStatusAction}>
                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                        <input type="hidden" name="newStatus" value="REJECTED" />
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          Reject
                        </button>
                      </form>
                    </>
                  )}

                  {/* Enroll (after payment) */}
                  {enrollment.status === "PAID" && (
                    <form action={updateEnrollmentStatusAction} className="flex gap-2 items-center">
                      <input type="hidden" name="enrollmentId" value={enrollment.id} />
                      <input type="hidden" name="newStatus" value="ENROLLED" />
                      <input
                        name="section"
                        placeholder="Section (e.g. A)"
                        className="px-2 py-1 text-xs border border-gray-300 rounded-lg w-24 font-mono focus:outline-none focus:border-maroon"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors font-medium"
                      >
                        Mark Enrolled
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
