import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect, notFound } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Calendar,
  Users,
  Tag,
  CheckCircle,
  Edit,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@ictirc/ui";

interface PaperDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperDetailPage({ params }: PaperDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get paper with authors
  const paper = await prisma.paper.findUnique({
    where: { id },
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
  });

  if (!paper) {
    notFound();
  }

  // Check if user is an author on this paper
  const userAuthorEntry = paper.authors.find(
    (a) => a.author.email === user.email
  );

  if (!userAuthorEntry) {
    // User is not an author on this paper
    redirect("/dashboard/papers");
  }

  const isCorresponding = userAuthorEntry.isCorrespondingAuthor;

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

  const badge = getStatusBadge(paper.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/papers"
          className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{paper.title}</h1>
            {isCorresponding && paper.status !== "PUBLISHED" && (
              <Button variant="secondary" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Paper
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
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
      </div>

      {/* Permissions Notice */}
      {!isCorresponding && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <p className="text-sm text-yellow-800">
              <strong>View Only:</strong> As a co-author, you can view this paper but 
              cannot make edits. Contact the corresponding author to request changes.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abstract */}
          <Card>
            <CardHeader>
              <CardTitle>Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {paper.abstract}
              </p>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manuscript */}
          {paper.rawFileUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Manuscript</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={paper.rawFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Download Manuscript</p>
                    <p className="text-sm text-gray-500">PDF/DOCX</p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Submitted</span>
                <span className="ml-auto font-mono text-gray-900">
                  {new Date(paper.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Category</span>
                <span className="ml-auto text-gray-900">
                  {paper.category?.name || "Uncategorized"}
                </span>
              </div>
              {paper.doi && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <span className="text-gray-500">DOI</span>
                  <span className="ml-auto font-mono text-xs text-maroon">
                    {paper.doi}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Authors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Authors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paper.authors.map((pa, i) => (
                  <div key={pa.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {pa.author.name}
                        {pa.isCorrespondingAuthor && (
                          <span className="ml-2 text-xs text-gold">★</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {pa.author.affiliation || pa.author.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
