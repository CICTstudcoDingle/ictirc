import type { Metadata } from "next";

export interface PaperMetadata {
  title: string;
  abstract: string;
  authors: { name: string; affiliation?: string }[];
  doi?: string;
  publishedAt?: Date;
  keywords: string[];
  pdfUrl?: string;
}

/**
 * Generates Next.js Metadata for a research paper page.
 * Includes Google Scholar Highwire Press tags and Dublin Core metadata.
 */
export function generatePaperMetadata(
  paper: PaperMetadata,
  baseUrl: string
): Metadata {
  const authorNames = paper.authors.map((a) => a.name);
  const publishDate = paper.publishedAt
    ? paper.publishedAt.toISOString().split("T")[0]?.replace(/-/g, "/")
    : undefined;

  return {
    title: paper.title,
    description: paper.abstract.slice(0, 160),
    authors: paper.authors.map((a) => ({ name: a.name })),
    keywords: paper.keywords,
    openGraph: {
      title: paper.title,
      description: paper.abstract.slice(0, 160),
      type: "article",
      publishedTime: paper.publishedAt?.toISOString(),
      authors: authorNames,
    },
    other: {
      // Google Scholar Highwire Press tags
      citation_title: paper.title,
      ...(paper.authors.length > 0 && {
        citation_author: authorNames.join("; "),
      }),
      ...(publishDate && { citation_publication_date: publishDate }),
      ...(paper.doi && { citation_doi: paper.doi }),
      ...(paper.pdfUrl && { citation_pdf_url: paper.pdfUrl }),
      citation_journal_title:
        "ICTIRC - Information and Communication Technology International Research Conference",
      citation_publisher: "ISUFST - College of Information and Computing Technology",

      // Dublin Core metadata
      "dc.title": paper.title,
      "dc.creator": authorNames.join(", "),
      "dc.description": paper.abstract,
      "dc.subject": paper.keywords.join(", "),
      "dc.rights": "Creative Commons Attribution-NoDerivs (CC BY-ND)",
      ...(paper.publishedAt && {
        "dc.date": paper.publishedAt.toISOString().split("T")[0],
      }),
      ...(paper.doi && { "dc.identifier": `doi:${paper.doi}` }),
    },
  };
}

/**
 * Generates JSON-LD structured data for a ScholarlyArticle.
 */
export function generatePaperJsonLd(
  paper: PaperMetadata,
  pageUrl: string
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    abstract: paper.abstract,
    author: paper.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      ...(author.affiliation && {
        affiliation: {
          "@type": "Organization",
          name: author.affiliation,
        },
      }),
    })),
    keywords: paper.keywords.join(", "),
    ...(paper.publishedAt && {
      datePublished: paper.publishedAt.toISOString().split("T")[0],
    }),
    ...(paper.doi && {
      identifier: {
        "@type": "PropertyValue",
        propertyID: "DOI",
        value: paper.doi,
      },
    }),
    license: "https://creativecommons.org/licenses/by-nd/4.0/",
    publisher: {
      "@type": "Organization",
      name: "ISUFST - College of Information and Computing Technology",
    },
    url: pageUrl,
  };
}
