import Link from "next/link";
import type { Metadata } from "next";
import { PaperCard } from "@/components/papers/paper-card";
import { CircuitBackground, Button, buttonVariants } from "@ictirc/ui";
import { ArchiveFilters } from "@/components/archive/archive-filters";
import { prisma } from "@ictirc/database";
// import { PaperStatus } from "@prisma/client";
// Mocking PaperStatus for now until generation works
type PaperStatus = "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "PUBLISHED" | "REJECTED";

export const metadata: Metadata = {
  title: "Research Archive",
  description:
    "Browse peer-reviewed ICT research papers from ICTIRC. Search by title, author, category, or keywords.",
};

export const revalidate = 0; // Disable static caching for search results

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const categoryName = params.category || "";
  const page = Number(params.page) || 1;
  const pageSize = 9;

  // 1. Fetch Categories for Filter
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Build Search Query (Soundex + ILIKE)
  let matchingIds: string[] | null = null;

  if (q) {
    // Basic sanitization not needed for Prisma parameters but good practice
    // Use raw query for Soundex
    const rawMatches = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Paper"
      WHERE "status" = 'PUBLISHED'
      AND (
        "title" ILIKE ${`%${q}%`}
        OR "abstract" ILIKE ${`%${q}%`}
        OR soundex("title") = soundex(${q})
      )
    `;
    matchingIds = rawMatches.map((m: { id: string }) => m.id);
  }

  // 3. Fetch Papers with Pagination & Filtering
  const whereClause: any = {
    status: "PUBLISHED",
  };

  if (matchingIds !== null) {
    whereClause.id = { in: matchingIds };
  }

  if (categoryName && categoryName !== "all") {
    whereClause.category = { name: categoryName };
  }

  const [totalCount, papers] = await Promise.all([
    prisma.paper.count({ where: whereClause }),
    prisma.paper.findMany({
      where: whereClause,
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: "asc" },
        },
        category: true,
      },
      orderBy: { publishedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Page Header - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-10 md:py-16 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Research Archive
          </h1>
          <p className="text-sm md:text-base text-gray-300">
            Browse peer-reviewed papers from ICTIRC researchers
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-200 py-4 md:py-6 sticky top-14 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArchiveFilters categories={categories} />
        </div>
      </section>

      {/* Results */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4 md:mb-6">
            Showing <span className="font-medium text-gray-900">{papers.length}</span> of{" "}
            <span className="font-medium text-gray-900">{totalCount}</span> papers
          </p>

          {/* Paper Grid */}
          {papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {papers.map((paper: any) => (
                <PaperCard
                  key={paper.id}
                  id={paper.id}
                  title={paper.title}
                  abstract={paper.abstract}
                  category={paper.category.name}
                  status={paper.status}
                  publishedAt={paper.publishedAt || undefined}
                  doi={paper.doi || undefined}
                  authors={paper.authors.map((pa: any) => ({
                    name: pa.author.name,
                  }))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No papers found matching your criteria.</p>
              {totalCount === 0 && !q && !categoryName && (
                <p className="text-sm text-gray-400 mt-2">The archive is currently empty.</p>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-1 md:gap-2">
                <Link
                  href={page > 1 ? `/archive?page=${page - 1}&q=${q}&category=${categoryName}` : "#"}
                  className={buttonVariants({ variant: "ghost", size: "sm" }) + (page <= 1 ? " pointer-events-none opacity-50" : "")}
                  aria-disabled={page <= 1}
                >
                  Previous
                </Link>

                <span className="px-3 py-1 bg-maroon text-white rounded-md text-sm font-medium">
                  Page {page} of {totalPages}
                </span>

                <Link
                  href={page < totalPages ? `/archive?page=${page + 1}&q=${q}&category=${categoryName}` : "#"}
                  className={buttonVariants({ variant: "ghost", size: "sm" }) + (page >= totalPages ? " pointer-events-none opacity-50" : "")}
                  aria-disabled={page >= totalPages}
                >
                  Next
                </Link>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
