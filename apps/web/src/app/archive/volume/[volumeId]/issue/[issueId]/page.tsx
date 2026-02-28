import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, FileText, BookOpen } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CircuitBackground } from "@ictirc/ui";
import { prisma } from "@ictirc/database";
import { IssuePapersFilter } from "@/components/archive/issue-papers-filter";

interface PageProps {
  params: Promise<{
    volumeId: string;
    issueId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { issueId } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { volume: true },
  });

  if (!issue) return { title: "Issue Not Found" };

  return {
    title: `Volume ${issue.volume.volumeNumber}, Issue ${issue.issueNumber}`,
    description: issue.theme || issue.description || "Conference proceedings",
  };
}

export default async function IssueDetailPage({ params }: PageProps) {
  const { volumeId, issueId } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      volume: true,
      conference: true,
      archivedPapers: {
        include: {
          category: true,
          authors: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: [
          { pageStart: "asc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!issue) {
    notFound();
  }

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-10 md:py-16 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/archive">
            <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-gold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-gold" />
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Volume {issue.volume.volumeNumber}, Issue {issue.issueNumber}
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-300">
            {issue.month} {issue.volume.year}
            {issue.issn && ` • ISSN ${issue.issn}`}
          </p>
        </div>
      </section>

      {/* Issue Info */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {issue.theme && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{issue.theme}</p>
                  {issue.description && (
                    <p className="text-muted-foreground mt-2">{issue.description}</p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Published: {new Date(issue.publishedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {issue.archivedPapers.length} paper{issue.archivedPapers.length !== 1 ? "s" : ""}
                </div>
                {issue.conference && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">{issue.conference.name}</p>
                    {issue.conference.location && (
                      <p className="text-sm text-muted-foreground">{issue.conference.location}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Papers List with Search & Filter */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Papers in this Issue</h2>

            {issue.archivedPapers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No papers published in this issue yet.</p>
                </CardContent>
              </Card>
            ) : (
                <IssuePapersFilter
                  papers={issue.archivedPapers.map((paper: any) => ({
                    id: paper.id,
                    title: paper.title,
                    abstract: paper.abstract,
                    authors: paper.authors,
                    category: paper.category,
                    doi: paper.doi,
                    pdfUrl: paper.pdfUrl,
                    pageStart: paper.pageStart,
                    pageEnd: paper.pageEnd,
                  }))}
                >
                  {(filteredPapers) => (
                    <div className="space-y-4">
                      {filteredPapers.map((paper) => (
                        <Card key={paper.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2">
                                  <Link
                                    href={`/archive/${paper.id}`}
                                    className="hover:text-maroon transition-colors"
                                  >
                                    {paper.title}
                                  </Link>
                                </CardTitle>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  <span>{paper.authors.map((a) => a.name).join(", ")}</span>
                                  {paper.pageStart && paper.pageEnd && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        Pages {paper.pageStart}-{paper.pageEnd}
                                      </span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span className="text-maroon font-medium">{paper.category.name}</span>
                                </div>
                              </div>
                              {paper.doi && (
                                <div className="ml-4">
                                  <a
                                    href={`https://doi.org/${paper.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-maroon"
                                  >
                                    DOI: {paper.doi}
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {paper.abstract}
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Link href={`/archive/${paper.id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                              {paper.pdfUrl && (
                                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm">
                                    Download PDF
                                  </Button>
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </IssuePapersFilter>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
