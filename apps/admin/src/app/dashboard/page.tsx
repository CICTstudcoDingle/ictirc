import { FileText, Users, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ictirc/ui";

// Mock stats - will be fetched from database
const stats = [
  { label: "Total Papers", value: "128", icon: FileText, color: "text-maroon" },
  { label: "Authors", value: "256", icon: Users, color: "text-blue-600" },
  { label: "Published", value: "89", icon: CheckCircle, color: "text-green-600" },
  { label: "Under Review", value: "24", icon: Clock, color: "text-amber-600" },
];

const recentSubmissions = [
  {
    id: "1",
    title: "Machine Learning Approaches for Network Intrusion Detection",
    author: "Juan Dela Cruz",
    status: "UNDER_REVIEW",
    date: "2024-01-28",
  },
  {
    id: "2",
    title: "Blockchain-based Academic Credential Verification",
    author: "Pedro Garcia",
    status: "ACCEPTED",
    date: "2024-01-27",
  },
  {
    id: "3",
    title: "Natural Language Processing for Filipino Sentiment Analysis",
    author: "Ana Reyes",
    status: "SUBMITTED",
    date: "2024-01-26",
  },
];

const statusColors = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-gold/20 text-amber-800",
  PUBLISHED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {recentSubmissions.map((paper) => (
              <div
                key={paper.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {paper.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    by {paper.author} • {paper.date}
                  </p>
                </div>
                <span
                  className={`ml-4 px-2.5 py-1 rounded-full text-xs font-medium ${
                    statusColors[paper.status as keyof typeof statusColors]
                  }`}
                >
                  {paper.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
