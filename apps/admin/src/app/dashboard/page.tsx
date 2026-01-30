"use client";

import { useState, useEffect } from "react";
import { FileText, Users, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ictirc/ui";

interface DashboardStats {
  totalPapers: number;
  publishedCount: number;
  underReviewCount: number;
  submittedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  totalAuthors: number;
  totalUsers: number;
}

interface RecentPaper {
  id: string;
  title: string;
  author: string;
  status: string;
  date: string;
}

const statusColors: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-gold/20 text-amber-800",
  PUBLISHED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPapers, setRecentPapers] = useState<RecentPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setStats(data.stats);
      setRecentPapers(data.recentPapers || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const statCards = stats
    ? [
      {
        label: "Total Papers",
        value: stats.totalPapers.toString(),
        icon: FileText,
        color: "text-maroon",
      },
      {
        label: "Authors",
        value: stats.totalAuthors.toString(),
        icon: Users,
        color: "text-blue-600",
      },
      {
        label: "Published",
        value: stats.publishedCount.toString(),
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        label: "Under Review",
        value: stats.underReviewCount.toString(),
        icon: Clock,
        color: "text-amber-600",
      },
    ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-maroon transition-colors disabled:opacity-50"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat) => (
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
          ))
        )}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse py-4 border-b border-gray-100 last:border-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentPapers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No papers submitted yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Papers will appear here once authors submit their research
              </p>
            </div>
          ) : (
                <div className="divide-y divide-gray-100">
                  {recentPapers.map((paper) => (
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
                      statusColors[paper.status] || "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {paper.status.replace("_", " ")}
                  </span>
                </div>
              ))}
                </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
