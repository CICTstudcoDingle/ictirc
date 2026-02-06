import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect } from "next/navigation";
import { FileText, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@ictirc/ui";

export default async function MyPapersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all papers where user's email is in the authors list
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
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Papers</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your research submissions
          </p>
        </div>
        <Link href="/dashboard/submit">
          <Button>Submit New Paper</Button>
        </Link>
      </div>

      {/* Papers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-maroon" />
            All Submissions ({papers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {papers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No papers yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start your research journey by submitting your first paper to ICTIRC.
              </p>
              <Link href="/dashboard/submit">
                <Button>Submit Your First Paper</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {papers.map((paper) => {
                const badge = getStatusBadge(paper.status);
                const userAuthorEntry = paper.authors.find(
                  (a) => a.author.email === user.email
                );
                const isCorresponding = userAuthorEntry?.isCorrespondingAuthor;
                const allAuthors = paper.authors.map((a) => a.author.name).join(", ");

                return (
                  <Link
                    key={paper.id}
                    href={`/dashboard/papers/${paper.id}`}
                    className="block py-5 hover:bg-gray-50 -mx-6 px-6 transition-colors first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {allAuthors}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {paper.category?.name || "Uncategorized"}
                          </span>
                          <span>•</span>
                          <span>
                            Submitted {new Date(paper.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={badge.class}>{badge.label}</span>
                        {isCorresponding ? (
                          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded font-medium">
                            Corresponding Author
                          </span>
                        ) : (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                            Co-Author
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Email-Based Matching</h4>
              <p className="text-sm text-blue-700 mt-1">
                Papers are automatically matched to your account based on the email address 
                used during submission. If you were listed as a co-author on a paper before 
                creating your account, those papers will appear here automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
