import type { Metadata } from "next";

export interface PaperMetadata {
  title: string;
  abstract: string;
  authors: { name: string; affiliation?: string; orcid?: string }[];
  doi?: string;
  publishedAt?: Date;
  keywords: string[];
  pdfUrl?: string;
  // Volume/Issue information
  volumeNumber?: number;
  issueNumber?: number;
  year?: number;
  issn?: string;
  pageStart?: number;
  pageEnd?: number;
  // Conference information
  conferenceName?: string;
  conferenceUrl?: string;
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

  // Build journal title with volume/issue info
  let journalTitle = "Journal of ICTIRC - ISUFST";
  if (paper.volumeNumber && paper.issueNumber) {
    journalTitle += ` Vol ${paper.volumeNumber}, Issue ${paper.issueNumber}`;
  }

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
        citation_author: paper.authors
          .map((a) => (a.orcid ? `${a.name} (ORCID: ${a.orcid})` : a.name))
          .join("; "),
      }),
      ...(publishDate && { citation_publication_date: publishDate }),
      ...(paper.doi && { citation_doi: paper.doi }),
      ...(paper.pdfUrl && { citation_pdf_url: paper.pdfUrl }),
      citation_journal_title: journalTitle,
      citation_publisher: "ISUFST - College of Information and Computing Technology",
      ...(paper.issn && { citation_issn: paper.issn }),
      ...(paper.volumeNumber && { citation_volume: paper.volumeNumber.toString() }),
      ...(paper.issueNumber && { citation_issue: paper.issueNumber.toString() }),
      ...(paper.pageStart && { citation_firstpage: paper.pageStart.toString() }),
      ...(paper.pageEnd && { citation_lastpage: paper.pageEnd.toString() }),
      ...(paper.conferenceName && { citation_conference_title: paper.conferenceName }),

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
      ...(paper.issn && { "dc.source": `ISSN ${paper.issn}` }),
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
  // Build journal title with volume/issue info
  let journalTitle = "Journal of ICTIRC - ISUFST";
  if (paper.volumeNumber && paper.issueNumber) {
    journalTitle += ` Vol ${paper.volumeNumber}, Issue ${paper.issueNumber}`;
  }

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
      ...(author.orcid && {
        identifier: {
          "@type": "PropertyValue",
          propertyID: "ORCID",
          value: author.orcid,
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
    isPartOf: {
      "@type": "PublicationIssue",
      ...(paper.issueNumber && { issueNumber: paper.issueNumber.toString() }),
      isPartOf: {
        "@type": "PublicationVolume",
        ...(paper.volumeNumber && { volumeNumber: paper.volumeNumber.toString() }),
        isPartOf: {
          "@type": "Periodical",
          name: journalTitle,
          ...(paper.issn && { issn: paper.issn }),
        },
      },
    },
    ...(paper.pageStart && paper.pageEnd && {
      pageStart: paper.pageStart.toString(),
      pageEnd: paper.pageEnd.toString(),
    }),
    license: "https://creativecommons.org/licenses/by-nd/4.0/",
    publisher: {
      "@type": "Organization",
      name: "ISUFST - College of Information and Computing Technology",
    },
    url: pageUrl,
  };
}
