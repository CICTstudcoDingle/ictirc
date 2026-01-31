import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, FileText } from "lucide-react";
import { Badge } from "@ictirc/ui";
import { generatePaperMetadata, generatePaperJsonLd } from "@ictirc/seo";
import { PaperActions } from "@/components/papers/paper-actions";
import { prisma } from "@ictirc/database";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const paper = await prisma.paper.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      category: true,
      authors: {
        include: { author: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!paper) {
    return {
      title: "Paper Not Found",
    };
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ictirc.org";

  const authors = paper.authors.map(pa => ({
    name: pa.author.name,
    affiliation: pa.author.affiliation || undefined,
  }));

  return generatePaperMetadata(
    {
      title: paper.title,
      abstract: paper.abstract,
      authors,
      keywords: paper.keywords,
      doi: paper.doi || undefined,
      publishedAt: paper.publishedAt || undefined,
      pdfUrl: paper.pdfUrl ? paper.pdfUrl : undefined,
    },
    baseUrl
  );
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const paper = await prisma.paper.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      category: true,
      authors: {
        include: { author: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!paper) {
    notFound();
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ictirc.org";

  const authors = paper.authors.map(pa => ({
    name: pa.author.name,
    affiliation: pa.author.affiliation || undefined,
  }));

  const jsonLd = generatePaperJsonLd(
    {
      title: paper.title,
      abstract: paper.abstract,
      authors,
      keywords: paper.keywords,
      doi: paper.doi || undefined,
      publishedAt: paper.publishedAt || undefined,
    },
    `${baseUrl}/archive/${id}`
  );

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </Link>
        </div>
      </div>

      {/* Paper Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-8 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
              <span className="text-xs md:text-sm font-medium text-maroon uppercase tracking-wide">
                {paper.category.name}
              </span>
              <Badge status="published">PUBLISHED</Badge>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {paper.title}
            </h1>

            {/* Authors */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-400" />
              {paper.authors.map((pa, i) => (
                <span key={pa.id} className="text-gray-700 text-sm md:text-base">
                  {pa.author.name}
                  {pa.author.affiliation && (
                    <span className="text-gray-400 text-xs md:text-sm">
                      {" "}({pa.author.affiliation})
                    </span>
                  )}
                  {i < paper.authors.length - 1 && ", "}
                </span>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
              {paper.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {paper.publishedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {paper.doi && (
                <div className="flex items-center gap-1 font-mono text-xs">
                  <FileText className="w-4 h-4" />
                  <span>DOI: {paper.doi}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <PaperActions
            pdfUrl={paper.pdfUrl || undefined}
            citation={`${paper.authors.map(pa => pa.author.name).join(", ")} (${paper.publishedAt?.getFullYear() || new Date().getFullYear()}). ${paper.title}. ICTIRC. DOI: ${paper.doi || "pending"}`}
          />

          {/* Abstract */}
          <div className="p-4 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Abstract</h2>
            <div className="prose prose-gray max-w-none">
              {paper.abstract.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Keywords */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
