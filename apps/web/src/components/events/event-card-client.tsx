"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Building2 } from "lucide-react";

import { ScrollAnimation } from "../ui/scroll-animation";

interface EventCardClientProps {
  event: {
    id: string;
    title: string;
    description: string;
    startDate: string; // Changed from Date to string for serialization
    location: string | null;
    venue: string | null;
  };
  isUpcoming: boolean;
  daysUntil: number;
  daysSince: number;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventCardClient({ event, isUpcoming, daysUntil, daysSince }: EventCardClientProps) {
  return (
    <>
      {/* Desktop Card */}
      <div className="hidden lg:block">
        <ScrollAnimation direction="right" delay={1.0}>
          <Link href={`/conferences/${event.id}`}>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group shadow-2xl">
              {/* Badge - Upcoming or Recently Completed */}
              {isUpcoming ? (
                <div className="inline-flex items-center gap-1.5 bg-gold text-maroon px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <Clock className="w-4 h-4" />
                  {daysUntil} {daysUntil === 1 ? "day" : "days"} remaining
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-gray-500/80 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <Calendar className="w-4 h-4" />
                  Completed {daysSince} {daysSince === 1 ? "day" : "days"} ago
                </div>
              )}

              {/* Event Title */}
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                {event.title}
              </h3>

              {/* Event Meta */}
              <div className="space-y-2 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                  {formatDate(event.startDate)}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                    {event.location}
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gold flex-shrink-0" />
                    {event.venue}
                  </div>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {event.description}
              </p>

              {/* CTA */}
              <div className="flex items-center text-gold font-medium text-sm group-hover:gap-2 transition-all">
                View Details
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </ScrollAnimation>
      </div>

      {/* Mobile Banner - Below hero content */}
      <div className="lg:hidden mt-8">
        <ScrollAnimation direction="up" delay={1.0}>
          <Link href={`/conferences/${event.id}`}>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 flex items-center justify-between gap-4 group shadow-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isUpcoming ? (
                    <>
                      <span className="bg-gold text-maroon px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {daysUntil}d
                      </span>
                      <span className="text-xs text-gray-400">Upcoming Event</span>
                    </>
                  ) : (
                    <>
                      <span className="bg-gray-500/80 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Recent
                      </span>
                      <span className="text-xs text-gray-400">Completed</span>
                    </>
                  )}
                </div>
                <h4 className="text-white font-semibold truncate group-hover:text-gold transition-colors">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-400">
                  {formatDate(event.startDate)}
                  {event.location && ` • ${event.location}`}
                  {event.venue && ` • ${event.venue}`}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </ScrollAnimation>
      </div>
    </>
  );
}
