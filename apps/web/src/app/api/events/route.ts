import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    // Fetch all published conferences
    const conferences = await prisma.conference.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "desc" },
    });

    // Separate into upcoming and past conferences
    const upcoming = conferences.filter((conference) => new Date(conference.startDate) >= now);
    const past = conferences.filter((conference) => new Date(conference.startDate) < now);

    // Sort upcoming by startDate ascending (nearest first)
    upcoming.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Format conferences with additional computed fields
    const formatEvent = (conference: typeof conferences[0]) => {
      const startDate = new Date(conference.startDate);
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...conference,
        isUpcoming: startDate >= now,
        daysUntil: daysUntil > 0 ? daysUntil : null,
        showCountdown: daysUntil > 0 && daysUntil <= 30,
      };
    };

    return NextResponse.json({
      upcoming: upcoming.map(formatEvent),
      past: past.map(formatEvent),
      nextEvent: upcoming.length > 0 ? formatEvent(upcoming[0]!) : null,
    });
  } catch (error) {
    console.error("[Events API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
