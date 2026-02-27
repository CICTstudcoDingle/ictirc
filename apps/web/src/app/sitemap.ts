import type { MetadataRoute } from "next";
import { prisma } from "@ictirc/database/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://irjict.isufstcict.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/committees`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/conferences`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic paper pages (archived papers only)
  let paperPages: MetadataRoute.Sitemap = [];
  let volumePages: MetadataRoute.Sitemap = [];
  let issuePages: MetadataRoute.Sitemap = [];
  
  try {
    // Get all archived papers
    const archivedPapers = await prisma.archivedPaper.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { publishedDate: "desc" },
    });

    paperPages = archivedPapers.map((paper) => ({
      url: `${baseUrl}/archive/${paper.id}`,
      lastModified: paper.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Get all volumes with issues
    const volumes = await prisma.volume.findMany({
      select: {
        id: true,
        updatedAt: true,
        issues: {
          select: { id: true, updatedAt: true },
        },
      },
      orderBy: { year: "desc" },
    });

    // Add volume pages
    volumePages = volumes.map((volume) => ({
      url: `${baseUrl}/archive/volume/${volume.id}`,
      lastModified: volume.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Add issue pages
    volumes.forEach((volume) => {
      volume.issues.forEach((issue) => {
        issuePages.push({
          url: `${baseUrl}/archive/volume/${volume.id}/issue/${issue.id}`,
          lastModified: issue.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        });
      });
    });
  } catch (error) {
    console.error("Failed to fetch archive data for sitemap:", error);
  }

  return [...staticPages, ...volumePages, ...issuePages, ...paperPages];
}
