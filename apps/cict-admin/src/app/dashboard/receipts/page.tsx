import { requireCictAccess } from "@/lib/auth";
import { prisma } from "@ictirc/database";

export default async function ReceiptsPage() {
  await requireCictAccess();

  const receipts = await prisma.cictReceipt.findMany({
    include: {
      payment: {
        include: {
          enrollment: true,
        },
      },
      issuedBy: true,
    },
    orderBy: { issuedAt: "desc" },
    take: 100,
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-maroon">Receipts</h1>
        <p className="mt-1 text-sm text-gray-600">Issued receipts from manual cashier postings.</p>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Receipt No</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Issued By</th>
                <th className="px-4 py-3">Issued At</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold">{receipt.receiptNo}</td>
                  <td className="px-4 py-3">
                    <p>{receipt.payerName}</p>
                    <p className="text-xs text-gray-500">{receipt.payment.enrollment.studentNumber}</p>
                  </td>
                  <td className="px-4 py-3">PHP {Number(receipt.payment.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{receipt.payment.referenceNumber}</td>
                  <td className="px-4 py-3">{receipt.issuedBy.name || receipt.issuedBy.email}</td>
                  <td className="px-4 py-3">{new Date(receipt.issuedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
