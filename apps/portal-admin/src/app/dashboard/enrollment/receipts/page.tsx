import { prisma } from "@ictirc/database";
import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";

export const metadata = { title: "Receipts — Enrollment" };

export default async function ReceiptsPage() {
  let receipts: {
    id: string;
    receiptNo: string;
    payerName: string;
    issuedAt: Date;
    payment: {
      amount: import("@prisma/client").Prisma.Decimal;
      method: import("@ictirc/database").CictCashierPaymentMethod;
      enrollment: {
        studentName: string;
        yearLevel: number;
        program: string;
        sectionName: string | null;
      };
    };
  }[] = [];

  try {
    receipts = await prisma.cictReceipt.findMany({
      orderBy: { issuedAt: "desc" },
      take: 100,
      include: {
        payment: {
          include: {
            enrollment: {
              select: { studentName: true, yearLevel: true, program: true, sectionName: true },
            },
          },
        },
      },
    });
  } catch {
    // DB not set up
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/enrollment"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {receipts.length} receipt{receipts.length !== 1 ? "s" : ""} issued
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {receipts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No receipts issued yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/70">
                <th className="text-left px-6 py-3">Receipt No.</th>
                <th className="text-left px-6 py-3">Student</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Method</th>
                <th className="text-left px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">{r.receiptNo}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.payment.enrollment.studentName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {r.payment.enrollment.program} Year {r.payment.enrollment.yearLevel}
                      {r.payment.enrollment.sectionName ? ` § ${r.payment.enrollment.sectionName}` : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-maroon font-mono">
                    ₱{Number(r.payment.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {r.payment.method.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                    {new Date(r.issuedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
