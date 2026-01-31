import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch counts with individual try-catch for resilience
    const [
      totalPapers,
      publishedCount,
      underReviewCount,
      submittedCount,
      acceptedCount,
      rejectedCount,
      totalAuthors,
      totalUsers,
      recentPapers,
    ] = await Promise.all([
      // Total papers
      prisma.paper.count().catch(() => 0),
      // Published papers
      prisma.paper.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
      // Under review
      prisma.paper.count({ where: { status: "UNDER_REVIEW" } }).catch(() => 0),
      // Submitted (pending)
      prisma.paper.count({ where: { status: "SUBMITTED" } }).catch(() => 0),
      // Accepted
      prisma.paper.count({ where: { status: "ACCEPTED" } }).catch(() => 0),
      // Rejected
      prisma.paper.count({ where: { status: "REJECTED" } }).catch(() => 0),
      // Total authors
      prisma.author.count().catch(() => 0),
      // Total users
      prisma.user.count().catch(() => 0),
      // Recent 5 paper submissions
      prisma.paper.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          authors: {
            include: { author: true },
            orderBy: { order: "asc" },
            take: 1,
          },
        },
      }).catch(() => []),
    ]);

    // Format recent papers for response
    const formattedPapers = (recentPapers || []).map((paper) => ({
      id: paper.id,
      title: paper.title,
      author: paper.authors[0]?.author?.name || "Unknown Author",
      status: paper.status,
      date: paper.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      stats: {
        totalPapers,
        publishedCount,
        underReviewCount,
        submittedCount,
        acceptedCount,
        rejectedCount,
        totalAuthors,
        totalUsers,
      },
      recentPapers: formattedPapers,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: String(error) },
      { status: 500 }
    );
  }
}
