import type { MetadataRoute } from "next";
import { prisma } from "@ictirc/database/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ictirc.isufst.edu.ph";

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
  ];

  // Dynamic paper pages (published only)
  let paperPages: MetadataRoute.Sitemap = [];
  
  try {
    const publishedPapers = await prisma.paper.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    paperPages = publishedPapers.map((paper) => ({
      url: `${baseUrl}/archive/${paper.id}`,
      lastModified: paper.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch papers for sitemap:", error);
  }

  return [...staticPages, ...paperPages];
}
