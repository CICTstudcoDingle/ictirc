import { getFeedback, getFeedbackStats } from "@/app/actions/feedback";
import { FeedbackTable } from "./feedback-table";

export default async function FeedbackPage() {
  const [feedbackData, stats] = await Promise.all([
    getFeedback({ isArchived: false }),
    getFeedbackStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage user feedback submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Active</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-bold text-maroon font-mono">{stats.unread}</p>
        </div>
        {stats.byCategory.slice(0, 2).map((cat) => (
          <div key={cat.category} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">{cat.category}</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">{cat.count}</p>
          </div>
        ))}
      </div>

      {/* Feedback Table */}
      <FeedbackTable
        initialFeedback={feedbackData.feedback}
        totalPages={feedbackData.totalPages}
        currentPage={feedbackData.page}
      />
    </div>
  );
}
