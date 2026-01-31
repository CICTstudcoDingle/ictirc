import { notFound, redirect } from 'next/navigation';
import { prisma } from '@ictirc/database';
import { ArrowLeft, Download, Calendar, Tag, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { ReviewComments } from '@/components/papers/review-comments';
import { ReviewerAssignment } from '@/components/papers/reviewer-assignment';
import { StatusControl } from '@/components/papers/status-control';
import { PublishButton } from '@/components/papers/publish-button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;

  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      category: true,
      authors: {
        include: {
          author: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      reviewers: {
        include: {
          reviewer: true,
        },
        orderBy: {
          assignedAt: 'desc',
        },
      },
    },
  });

  if (!paper) {
    notFound();
  }

  const isPdf = paper.rawFileUrl?.toLowerCase().endsWith('.pdf');
  const isDocx = paper.rawFileUrl?.toLowerCase().match(/\.docx?$/);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/papers"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Papers
            </Link>
            <div className="flex items-center gap-3">
              {paper.status !== 'PUBLISHED' && (
                <PublishButton
                  paperId={paper.id}
                  hasFile={!!paper.rawFileUrl}
                  isDocx={!!paper.rawFileUrl?.toLowerCase().match(/\.docx?$/)}
                />
              )}
              <StatusControl paperId={paper.id} currentStatus={paper.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{paper.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {paper.authors.map((pa) => pa.author.name).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>{paper.category.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Abstract</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{paper.abstract}</p>
              </div>

              {paper.keywords.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-2">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paper.doi && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-700 mb-2">DOI</h2>
                  <p className="text-gray-600 font-mono text-sm">{paper.doi}</p>
                </div>
              )}
            </div>

            {/* PDF Viewer or Download */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Manuscript
                </h2>
                {paper.rawFileUrl && (
                  <a
                    href={paper.rawFileUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
              </div>

              {!paper.rawFileUrl && (
                <p className="text-gray-500 text-center py-12">No file uploaded</p>
              )}

              {isPdf && paper.rawFileUrl && (
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={paper.rawFileUrl}
                    className="w-full h-[800px]"
                    title="Paper PDF"
                  />
                </div>
              )}

              {isDocx && paper.rawFileUrl && (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    This is a Word document. Click Download to view it.
                  </p>
                  <a
                    href={paper.rawFileUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Document
                  </a>
                </div>
              )}
            </div>

            {/* Review Comments */}
            <ReviewComments paperId={paper.id} initialComments={paper.comments} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Paper Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Current Status</p>
                  <p className="text-sm font-medium text-gray-900">{paper.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="text-sm text-gray-900">{new Date(paper.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{new Date(paper.updatedAt).toLocaleString()}</p>
                </div>
                {paper.publishedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Published</p>
                    <p className="text-sm text-gray-900">{new Date(paper.publishedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviewer Assignment */}
            <ReviewerAssignment paperId={paper.id} currentReviewers={paper.reviewers} />

            {/* Authors Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Authors</h3>
              <div className="space-y-3">
                {paper.authors.map((pa) => (
                  <div key={pa.id}>
                    <p className="text-sm font-medium text-gray-900">{pa.author.name}</p>
                    <p className="text-xs text-gray-500">{pa.author.email}</p>
                    {pa.author.affiliation && (
                      <p className="text-xs text-gray-600 mt-1">{pa.author.affiliation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
