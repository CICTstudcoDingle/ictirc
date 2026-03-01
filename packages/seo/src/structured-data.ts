import type { Metadata } from "next";

export interface OrganizationData {
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  email?: string | string[];
  telephone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  sameAs?: string[]; // Social media profiles
}

/**
 * Generates Organization JSON-LD for Google Rich Results
 * Shows logo, contact info, and social profiles in search results
 */
export function generateOrganizationJsonLd(org: OrganizationData): object {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: org.name,
    ...(org.alternateName && { alternateName: org.alternateName }),
    url: org.url,
    logo: {
      "@type": "ImageObject",
      url: org.logo,
    },
    description: org.description,
    ...(org.email && { email: org.email }),
    ...(org.telephone && { telephone: org.telephone }),
    ...(org.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: org.address.streetAddress,
        addressLocality: org.address.addressLocality,
        addressRegion: org.address.addressRegion,
        addressCountry: org.address.addressCountry,
      },
    }),
    ...(org.sameAs && org.sameAs.length > 0 && { sameAs: org.sameAs }),
  };
}

/**
 * Generates Website JSON-LD with SearchAction
 * Enables site search box in Google search results
 */
export function generateWebsiteJsonLd(
  url: string,
  name: string,
  searchUrl: string
): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates BreadcrumbList JSON-LD for navigation paths
 * Shows breadcrumb trail in search results
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates CollectionPage JSON-LD for archives/volumes
 */
export function generateCollectionPageJsonLd(
  name: string,
  description: string,
  url: string,
  itemCount?: number
): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    ...(itemCount && { numberOfItems: itemCount }),
  };
}

export function generateEventJsonLd(event: {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  url: string;
  imageUrl?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    ...(event.description && { description: event.description }),
    startDate: event.startDate.toISOString(),
    ...(event.endDate && { endDate: event.endDate.toISOString() }),
    ...(event.location && {
      location: {
        "@type": "Place",
        name: event.location,
      },
    }),
    url: event.url,
    ...(event.imageUrl && { image: event.imageUrl }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}
