import { prisma } from "@ictirc/database";
import { EventCardClient } from "./event-card-client";

export async function UpcomingEventCard() {
  const now = new Date();

  // Fetch the next upcoming event within 60 days (expanded window to catch events like March conference)
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  let upcomingEvent = await prisma.event.findFirst({
    where: {
      isPublished: true,
      startDate: {
        gte: now,
        lte: sixtyDaysFromNow,
      },
    },
    orderBy: { startDate: "asc" },
  });

  // Fallback: If no upcoming events, show most recent past event
  if (!upcomingEvent) {
    upcomingEvent = await prisma.event.findFirst({
      where: {
        isPublished: true,
        startDate: {
          lt: now,
        },
      },
      orderBy: { startDate: "desc" },
    });
  }

  // Hide card completely if no events exist at all
  if (!upcomingEvent) {
    return null;
  }

  const eventStartDate = new Date(upcomingEvent.startDate);
  const isUpcoming = eventStartDate >= now;
  const daysUntil = Math.ceil(
    (eventStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysSince = Math.ceil(
    (now.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Serialize the event data for client component
  const serializedEvent = {
    id: upcomingEvent.id,
    title: upcomingEvent.title,
    description: upcomingEvent.description,
    startDate: upcomingEvent.startDate.toISOString(), // Convert Date to string
    location: upcomingEvent.location,
  };

  return (
    <EventCardClient
      event={serializedEvent}
      isUpcoming={isUpcoming}
      daysUntil={daysUntil}
      daysSince={daysSince}
    />
  );
}
