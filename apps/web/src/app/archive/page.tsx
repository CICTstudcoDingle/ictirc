import Link from "next/link";
import type { Metadata } from "next";
import { PaperCard } from "@/components/papers/paper-card";
import { CircuitBackground, Button, buttonVariants, Tabs, TabsContent, TabsList, TabsTrigger } from "@ictirc/ui";
import { ArchiveFilters } from "@/components/archive/archive-filters";
import { ArchiveVolumesView } from "@/components/archive/archive-volumes-view";
import { prisma } from "@ictirc/database";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

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
    year?: string;
    author?: string;
    page?: string;
    view?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const categoryName = params.category || "";
  const year = params.year || "";
  const authorId = params.author || "";
  const page = Number(params.page) || 1;
  const view = params.view || "volumes"; // Default to volumes view
  const pageSize = 9;

  // 1. Fetch Categories, Years, and Authors for Filters
  const [categories, papersForYears, authors] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.paper.findMany({
      where: { status: "PUBLISHED", NOT: { publishedAt: null } },
      select: { publishedAt: true },
      distinct: ["publishedAt"],
    }),
    prisma.author.findMany({
      where: {
        papers: {
          some: {
            paper: { status: "PUBLISHED" }
          }
        }
      },
      orderBy: { name: "asc" },
      take: 50, // Limit to prominent authors for now
    })
  ]);

  const distinctYears = Array.from(
    new Set(
      papersForYears
        .map((p) => p.publishedAt?.getFullYear())
        .filter((y): y is number => !!y)
    )
  ).sort((a: number, b: number) => b - a);

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
    const selectedCategory = await prisma.category.findUnique({
      where: { name: categoryName },
      include: { children: { select: { id: true } } },
    });

    if (selectedCategory) {
      if (selectedCategory.children.length > 0) {
        whereClause.categoryId = {
          in: [selectedCategory.id, ...selectedCategory.children.map((c) => c.id)],
        };
      } else {
        whereClause.categoryId = selectedCategory.id;
      }
    }
  }

  if (year && year !== "all") {
    const yearInt = parseInt(year);
    whereClause.publishedAt = {
      gte: new Date(yearInt, 0, 1),
      lte: new Date(yearInt, 11, 31, 23, 59, 59),
    };
  }

  if (authorId && authorId !== "all") {
    whereClause.authors = {
      some: {
        authorId: authorId,
      }
    };
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
          <ScrollAnimation direction="up">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Research <span className="text-gold">Archive</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Browse peer-reviewed papers from ICTIRC researchers
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-200 py-4 md:py-6 sticky top-14 md:top-16 z-40">
        <ScrollAnimation direction="up" delay={0.2} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <ArchiveFilters
              categories={categories}
              years={distinctYears}
              authors={authors.map(a => ({ id: a.id, name: a.name }))}
            />
            <div className="flex gap-2">
              <Link href="/archive?view=volumes">
                <Button variant={view === "volumes" ? "primary" : "outline"} size="sm">
                  By Volume
                </Button>
              </Link>
              <Link href="/archive?view=papers">
                <Button variant={view === "papers" ? "primary" : "outline"} size="sm">
                  All Papers
                </Button>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Results */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === "volumes" ? (
            <ArchiveVolumesView />
          ) : (
            <>
                {/* Results count */}
                <p className="text-sm text-gray-500 mb-4 md:mb-6">
                  Showing <span className="font-medium text-gray-900">{papers.length}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalCount}</span> papers
                </p>

                {/* Paper Grid */}
                {papers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {papers.map((paper: any, index: number) => (
                      <ScrollAnimation key={paper.id} direction="up" staggerIndex={index % 2}>
                        <PaperCard
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
                      </ScrollAnimation>
                    ))}
                  </div>
                ) : (
                    <ScrollAnimation direction="up">
                      <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No papers found matching your criteria.</p>
                        {totalCount === 0 && !q && !categoryName && (
                          <p className="text-sm text-gray-400 mt-2">The archive is currently empty.</p>
                        )}
                      </div>
                    </ScrollAnimation>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-1 md:gap-2">
                      <Link
                        href={page > 1 ? `/archive?page=${page - 1}&q=${q}&category=${categoryName}&view=papers` : "#"}
                        className={buttonVariants({ variant: "ghost", size: "sm" }) + (page <= 1 ? " pointer-events-none opacity-50" : "")}
                        aria-disabled={page <= 1}
                      >
                        Previous
                      </Link>

                      <span className="px-3 py-1 bg-maroon text-white rounded-md text-sm font-medium">
                        Page {page} of {totalPages}
                      </span>

                      <Link
                        href={page < totalPages ? `/archive?page=${page + 1}&q=${q}&category=${categoryName}&view=papers` : "#"}
                        className={buttonVariants({ variant: "ghost", size: "sm" }) + (page >= totalPages ? " pointer-events-none opacity-50" : "")}
                        aria-disabled={page >= totalPages}
                      >
                        Next
                      </Link>
                    </nav>
                  </div>
                )}
              </>
          )}
        </div>
      </section>
    </div>
  );
}
