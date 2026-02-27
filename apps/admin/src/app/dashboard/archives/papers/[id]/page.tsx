import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@ictirc/database";
import {
  ArrowLeft, BookOpen, Calendar, Tag, Users, FileText, ExternalLink,
  Download, BookMarked, Hash,
} from "lucide-react";
import { Button } from "@ictirc/ui";
import { DeleteArchivedPaperButton } from "@/components/archives/delete-archived-paper-button";
import { EditArchivedPaperForm } from "@/components/archives/edit-archived-paper-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const paper = await prisma.archivedPaper.findUnique({
    where: { id },
    select: { title: true },
  });
  return { title: paper?.title ?? "Archived Paper" };
}

export default async function ArchivedPaperDetailPage({ params }: PageProps) {
  const { id } = await params;

  const paper = await prisma.archivedPaper.findUnique({
    where: { id },
    include: {
      authors: { orderBy: { order: "asc" } },
      category: true,
      issue: {
        include: {
          volume: true,
          conference: true,
        },
      },
      uploader: { select: { id: true, name: true, email: true } },
    },
  });

  if (!paper) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const issues = await prisma.issue.findMany({
    include: { volume: true },
    orderBy: [{ volume: { year: "desc" } }, { issueNumber: "asc" }],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ─── Back nav ─── */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/papers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Papers
          </Button>
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/dashboard/archives">
          <Button variant="ghost" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Archives
          </Button>
        </Link>
      </div>

      {/* ─── Header ─── */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg mt-1">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mb-2">
                <BookMarked className="w-3 h-3" />
                Archived Paper
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{paper.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {paper.authors.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <DeleteArchivedPaperButton paperId={paper.id} paperTitle={paper.title} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ─── Main Content ─── */}
        <div className="col-span-2 space-y-6">
          {/* Edit Form */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Edit Paper Details</h2>
            </div>
            <div className="p-6">
              <EditArchivedPaperForm
                paper={paper}
                categories={categories}
                issues={issues}
              />
            </div>
          </div>

          {/* Abstract */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Abstract
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 leading-relaxed">{paper.abstract}</p>
            </div>
          </div>

          {/* Authors */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Authors ({paper.authors.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {paper.authors.map((author, i) => (
                <div key={author.id} className="px-6 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-700 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm">{author.name}</p>
                      {author.isCorresponding && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                          Corresponding
                        </span>
                      )}
                    </div>
                    {author.affiliation && (
                      <p className="text-xs text-gray-500 mt-0.5">{author.affiliation}</p>
                    )}
                    {author.email && (
                      <p className="text-xs text-gray-400 mt-0.5">{author.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Publication Info</h3>

            <div className="space-y-3 text-sm">
              {/* Category */}
              <div className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-gray-900 font-medium">
                    {paper.category?.name ?? "—"}
                  </p>
                </div>
              </div>

              {/* Issue / Volume */}
              {paper.issue && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Issue / Volume</p>
                    <p className="text-gray-900 font-medium">
                      Vol.{paper.issue.volume?.volumeNumber} No.{paper.issue.issueNumber}
                      {paper.issue.volume?.year
                        ? ` (${paper.issue.volume.year})`
                        : ""}
                    </p>
                    {paper.issue.conference?.name && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {paper.issue.conference.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Pages */}
              {(paper.pageStart || paper.pageEnd) && (
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Pages</p>
                    <p className="text-gray-900 font-medium">
                      {paper.pageStart ?? "?"}–{paper.pageEnd ?? "?"}
                    </p>
                  </div>
                </div>
              )}

              {/* DOI */}
              {paper.doi && (
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">DOI</p>
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono text-xs"
                    >
                      {paper.doi}
                    </a>
                  </div>
                </div>
              )}

              {/* Published Date */}
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Published</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(paper.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Uploaded by */}
              {paper.uploader && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Uploaded by</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {paper.uploader.name ?? paper.uploader.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(paper.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          {paper.keywords.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Files</h3>
            <div className="space-y-2">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
              {paper.docxUrl && (
                <a
                  href={paper.docxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Download DOCX
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
