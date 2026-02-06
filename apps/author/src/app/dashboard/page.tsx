import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@ictirc/ui";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's papers based on email matching
  const papers = await prisma.paper.findMany({
    where: {
      authors: {
        some: {
          author: {
            email: user.email!,
          },
        },
      },
    },
    include: {
      authors: {
        include: {
          author: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Calculate stats
  const totalPapers = papers.length;
  const pendingReview = papers.filter(
    (p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW"
  ).length;
  const accepted = papers.filter((p) => p.status === "ACCEPTED").length;
  const published = papers.filter((p) => p.status === "PUBLISHED").length;

  const stats = [
    {
      label: "Total Papers",
      value: totalPapers,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Under Review",
      value: pendingReview,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Published",
      value: published,
      icon: AlertCircle,
      color: "text-gold",
      bgColor: "bg-gold/20",
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      SUBMITTED: { class: "status-badge status-submitted", label: "Submitted" },
      UNDER_REVIEW: { class: "status-badge status-review", label: "Under Review" },
      ACCEPTED: { class: "status-badge status-accepted", label: "Accepted" },
      REJECTED: { class: "status-badge status-rejected", label: "Rejected" },
      PUBLISHED: { class: "status-badge status-published", label: "Published" },
    };
    return badges[status] || { class: "status-badge", label: status };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s an overview of your research submissions.
          </p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit New Paper
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Papers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Submissions</CardTitle>
          <Link
            href="/dashboard/papers"
            className="text-sm text-maroon hover:underline"
          >
            View All →
          </Link>
        </CardHeader>
        <CardContent>
          {papers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                You haven&apos;t submitted any papers yet.
              </p>
              <Link href="/dashboard/submit">
                <Button>Submit Your First Paper</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {papers.map((paper) => {
                const badge = getStatusBadge(paper.status);
                const isCorrespondingAuthor = paper.authors.find(
                  (a) =>
                    a.author.email === user.email && a.isCorrespondingAuthor
                );
                return (
                  <Link
                    key={paper.id}
                    href={`/dashboard/papers/${paper.id}`}
                    className="block py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {paper.category?.name || "Uncategorized"} •{" "}
                          {new Date(paper.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={badge.class}>{badge.label}</span>
                          {isCorrespondingAuthor && (
                            <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                              Corresponding Author
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
