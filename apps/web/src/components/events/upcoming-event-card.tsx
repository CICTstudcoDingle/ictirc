import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@ictirc/database";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function UpcomingEventCard() {
  const now = new Date();

  // Fetch the next upcoming event within 30 days
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const upcomingEvent = await prisma.event.findFirst({
    where: {
      isPublished: true,
      startDate: {
        gte: now,
        lte: thirtyDaysFromNow,
      },
    },
    orderBy: { startDate: "asc" },
  });

  if (!upcomingEvent) {
    return null;
  }

  const daysUntil = Math.ceil(
    (new Date(upcomingEvent.startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Desktop Card - Floating on right side */}
      <div className="hidden lg:block lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-8 xl:right-16 w-80 z-20">
        <Link href={`/conferences/${upcomingEvent.id}`}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group">
            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 bg-gold text-maroon px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <Clock className="w-4 h-4" />
              {daysUntil} {daysUntil === 1 ? "day" : "days"} remaining
            </div>

            {/* Event Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
              {upcomingEvent.title}
            </h3>

            {/* Event Meta */}
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                {formatDate(upcomingEvent.startDate)}
              </div>
              {upcomingEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  {upcomingEvent.location}
                </div>
              )}
            </div>

            {/* Description Preview */}
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {upcomingEvent.description}
            </p>

            {/* CTA */}
            <div className="flex items-center text-gold font-medium text-sm group-hover:gap-2 transition-all">
              View Details
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Mobile Banner - Below hero content */}
      <div className="lg:hidden mt-8">
        <Link href={`/conferences/${upcomingEvent.id}`}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center justify-between gap-4 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gold text-maroon px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {daysUntil}d
                </span>
                <span className="text-xs text-gray-400">Upcoming Event</span>
              </div>
              <h4 className="text-white font-semibold truncate group-hover:text-gold transition-colors">
                {upcomingEvent.title}
              </h4>
              <p className="text-xs text-gray-400">
                {formatDate(upcomingEvent.startDate)}
                {upcomingEvent.location && ` • ${upcomingEvent.location}`}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </>
  );
}
