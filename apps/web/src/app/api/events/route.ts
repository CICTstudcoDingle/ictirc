import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    // Fetch all published events
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "desc" },
    });

    // Separate into upcoming and past events
    const upcoming = events.filter((event) => new Date(event.startDate) >= now);
    const past = events.filter((event) => new Date(event.startDate) < now);

    // Sort upcoming by startDate ascending (nearest first)
    upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Format events with additional computed fields
    const formatEvent = (event: typeof events[0]) => {
      const startDate = new Date(event.startDate);
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...event,
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
