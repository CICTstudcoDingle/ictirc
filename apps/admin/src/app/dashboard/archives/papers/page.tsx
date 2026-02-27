import Link from "next/link";
import { prisma } from "@ictirc/database";
import { Button } from "@ictirc/ui";
import {
  ArrowLeft, BookOpen, Upload, Eye, Edit, Search, BookMarked,
} from "lucide-react";
import { DeleteArchivedPaperButton } from "@/components/archives/delete-archived-paper-button";

export const metadata = {
  title: "Archived Papers",
  description: "Browse and manage all archived research papers",
};

interface SearchParams {
  search?: string;
  category?: string;
  issueId?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function getArchivedPapers(filters: SearchParams) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { abstract: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.categoryId = filters.category;
  }

  if (filters.issueId) {
    where.issueId = filters.issueId;
  }

  return prisma.archivedPaper.findMany({
    where,
    include: {
      authors: { orderBy: { order: "asc" }, take: 3 },
      category: { select: { id: true, name: true } },
      issue: {
        include: {
          volume: { select: { volumeNumber: true, year: true } },
          conference: { select: { name: true } },
        },
      },
    },
    orderBy: [
      { issue: { publishedDate: "desc" } },
      { pageStart: "asc" },
    ],
  });
}

export default async function ArchivedPapersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [papers, categories, issues] = await Promise.all([
    getArchivedPapers(params),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.issue.findMany({
      include: { volume: { select: { volumeNumber: true, year: true } } },
      orderBy: [{ volume: { year: "desc" } }, { issueNumber: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/archives">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Archives
              </Button>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">Papers</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Archived Papers</h1>
          <p className="text-gray-500 mt-0.5">
            {papers.length} paper{papers.length !== 1 ? "s" : ""} in the archive
          </p>
        </div>
        <Link href="/dashboard/archives/upload">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Papers
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <form className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Search archived papers..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
          />
        </div>
        <select
          name="category"
          defaultValue={params.category}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          name="issueId"
          defaultValue={params.issueId}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Issues</option>
          {issues.map((issue) => (
            <option key={issue.id} value={issue.id}>
              Vol.{issue.volume?.volumeNumber} No.{issue.issueNumber}
              {issue.volume?.year ? ` (${issue.volume.year})` : ""}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors"
        >
          Search
        </button>
        {(params.search || params.category || params.issueId) && (
          <Link href="/dashboard/archives/papers">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {papers.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No archived papers found</p>
            {!params.search && !params.category && !params.issueId && (
              <Link href="/dashboard/archives/upload" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Paper
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paper
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pages
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="w-28 text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {papers.map((paper) => {
                const authors = paper.authors.map((a) => a.name).join(", ");
                const moreAuthors = paper.authors.length > 3
                  ? ` +${paper.authors.length - 3} more`
                  : "";
                const issueLabel = paper.issue
                  ? `Vol.${paper.issue.volume?.volumeNumber ?? "?"} No.${paper.issue.issueNumber}${
                      paper.issue.volume?.year ? ` (${paper.issue.volume.year})` : ""
                    }`
                  : "—";

                return (
                  <tr key={paper.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <BookMarked className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-1 text-sm">
                            {paper.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {authors}{moreAuthors}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {paper.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">
                        {issueLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">
                        {paper.pageStart && paper.pageEnd
                          ? `${paper.pageStart}–${paper.pageEnd}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">
                        {new Date(paper.publishedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/archives/papers/${paper.id}`}
                          className="p-1.5 hover:bg-orange-50 text-orange-600 rounded transition-colors"
                          title="View & Edit paper"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/archives/papers/${paper.id}`}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded transition-colors"
                          title="Edit paper"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteArchivedPaperButton
                          paperId={paper.id}
                          paperTitle={paper.title}
                          compact
                          redirectTo="/dashboard/archives/papers"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
