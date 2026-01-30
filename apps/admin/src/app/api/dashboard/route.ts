import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";

export async function GET() {
  try {
    // Fetch paper counts by status
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
      recentActivity,
    ] = await Promise.all([
      // Total papers
      prisma.paper.count(),
      // Published papers
      prisma.paper.count({ where: { status: "PUBLISHED" } }),
      // Under review
      prisma.paper.count({ where: { status: "UNDER_REVIEW" } }),
      // Submitted (pending)
      prisma.paper.count({ where: { status: "SUBMITTED" } }),
      // Accepted
      prisma.paper.count({ where: { status: "ACCEPTED" } }),
      // Rejected
      prisma.paper.count({ where: { status: "REJECTED" } }),
      // Total authors
      prisma.author.count(),
      // Total users
      prisma.user.count(),
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
      }),
      // Recent 5 audit log entries
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format recent papers for response
    const formattedPapers = recentPapers.map((paper) => ({
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
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
