import { prisma } from "@ictirc/database";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, FileText, Building, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

async function getAuthor(id: string) {
  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      papers: {
        where: {
          paper: {
            status: "PUBLISHED",
          },
        },
        include: {
          paper: {
            select: {
              id: true,
              title: true,
              abstract: true,
              doi: true,
              publishedAt: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          paper: {
            publishedAt: "desc",
          },
        },
      },
    },
  });

  return author;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthor(id);

  if (!author) {
    return {
      title: "Author Not Found | ISUFST CICT Research Repository",
    };
  }

  return {
    title: `${author.name} | ISUFST CICT Research Repository`,
    description: `View research papers published by ${author.name}${author.affiliation ? ` from ${author.affiliation}` : ""}.`,
  };
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = await getAuthor(id);

  if (!author) {
    notFound();
  }

  const publishedPapers = author.papers.map((p) => p.paper);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/authors"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Authors
          </Link>
        </div>
      </div>

      {/* Author Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-maroon/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-maroon">
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
              {author.affiliation && (
                <p className="mt-2 text-gray-600 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {author.affiliation}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <div className="px-4 py-2 bg-maroon/10 rounded-lg">
                  <div className="text-2xl font-bold text-maroon">{publishedPapers.length}</div>
                  <div className="text-xs text-gray-600">Publications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Published Papers</h2>

        {publishedPapers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No published papers yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedPapers.map((paper) => (
              <Link
                key={paper.id}
                href={`/archive/${paper.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-maroon/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-maroon transition-colors">
                      {paper.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {paper.category && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {paper.category.name}
                        </span>
                      )}
                      {paper.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(paper.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                      {paper.doi && (
                        <span className="font-mono text-maroon">
                          DOI: {paper.doi}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-maroon transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
