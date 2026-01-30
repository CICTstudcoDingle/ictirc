import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, FileText } from "lucide-react";
import { Badge } from "@ictirc/ui";
import { generatePaperMetadata, generatePaperJsonLd } from "@ictirc/seo";
import { PaperActions } from "@/components/papers/paper-actions";

// Mock data - will be fetched from database
const mockPaper = {
  id: "1",
  title: "Machine Learning Approaches for Network Intrusion Detection in IoT Environments",
  abstract: `This paper presents a comprehensive study of machine learning techniques for detecting network intrusions in Internet of Things environments. We evaluate multiple algorithms including Random Forest, XGBoost, and deep learning models on benchmark datasets.

Our experimental results demonstrate that ensemble methods achieve superior performance with an F1-score of 0.94, while maintaining computational efficiency suitable for resource-constrained IoT devices. We also propose a novel feature selection technique that reduces dimensionality by 60% without significant loss in detection accuracy.

The findings contribute to the growing body of knowledge in IoT security and provide practical guidelines for implementing ML-based intrusion detection systems in real-world scenarios.`,
  keywords: ["Machine Learning", "IoT Security", "Intrusion Detection", "Network Security", "Deep Learning"],
  authors: [
    { name: "Juan Dela Cruz", affiliation: "ISUFST - CICT" },
    { name: "Maria Santos", affiliation: "ISUFST - CICT" },
  ],
  category: "Cybersecurity",
  publishedAt: new Date("2024-06-15"),
  doi: "10.ISUFST.CICT/2024.00001",
  status: "PUBLISHED" as const,
  pdfUrl: "/papers/sample.pdf",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = mockPaper;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ictirc.org";

  return generatePaperMetadata(
    {
      title: paper.title,
      abstract: paper.abstract,
      authors: paper.authors,
      keywords: paper.keywords,
      doi: paper.doi,
      publishedAt: paper.publishedAt,
      pdfUrl: paper.pdfUrl ? `${baseUrl}${paper.pdfUrl}` : undefined,
    },
    baseUrl
  );
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;
  const paper = mockPaper;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ictirc.org";

  const jsonLd = generatePaperJsonLd(
    {
      title: paper.title,
      abstract: paper.abstract,
      authors: paper.authors,
      keywords: paper.keywords,
      doi: paper.doi,
      publishedAt: paper.publishedAt,
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
                {paper.category}
              </span>
              <Badge status="published">{paper.status}</Badge>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {paper.title}
            </h1>

            {/* Authors */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-400" />
              {paper.authors.map((author, i) => (
                <span key={author.name} className="text-gray-700 text-sm md:text-base">
                  {author.name}
                  {author.affiliation && (
                    <span className="text-gray-400 text-xs md:text-sm">
                      {" "}({author.affiliation})
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
            pdfUrl={paper.pdfUrl}
            citation={`${paper.authors.map(a => a.name).join(", ")} (${paper.publishedAt?.getFullYear()}). ${paper.title}. ICTIRC. DOI: ${paper.doi}`}
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
