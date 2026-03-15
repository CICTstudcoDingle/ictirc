import type { Metadata } from "next";
import PublicPageLayout from "@/components/layout/public-page-layout";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "Browse upcoming CICT events, register for activities, and never miss a deadline.",
};

// Static placeholder events
const upcomingEvents = [
  {
    id: 1,
    title: "IO Week 2025",
    slug: "io-week-2025",
    type: "competition",
    typeLabel: "Competition",
    date: "April 7–11, 2025",
    time: "8:00 AM – 5:00 PM",
    location: "ISUFST Dingle Campus",
    description:
      "A week-long celebration of innovation, outreach, and technology. Featuring coding competitions, hackathons, tech talks, and more.",
    isFeatured: true,
    maxAttendees: 500,
    registered: 327,
  },
  {
    id: 2,
    title: "General Assembly — 2nd Semester",
    slug: "general-assembly-2nd-sem",
    type: "meeting",
    typeLabel: "Meeting",
    date: "March 21, 2025",
    time: "1:00 PM – 4:00 PM",
    location: "Multipurpose Hall",
    description:
      "Mandatory general assembly for all CICT students. Updates on council activities, upcoming events, and student concerns.",
    isFeatured: false,
    maxAttendees: 600,
    registered: 412,
  },
  {
    id: 3,
    title: "Web Development Workshop",
    slug: "web-dev-workshop",
    type: "workshop",
    typeLabel: "Workshop",
    date: "March 28, 2025",
    time: "9:00 AM – 12:00 PM",
    location: "CompLab 3",
    description:
      "Hands-on workshop covering React, Next.js, and modern web development best practices. Open to all year levels.",
    isFeatured: false,
    maxAttendees: 40,
    registered: 35,
  },
  {
    id: 4,
    title: "CICT Intramurals 2025",
    slug: "intramurals-2025",
    type: "social",
    typeLabel: "Social",
    date: "April 14–16, 2025",
    time: "7:00 AM – 6:00 PM",
    location: "ISUFST Gymnasium & Grounds",
    description:
      "Annual sports festival featuring basketball, volleyball, chess, and e-sports tournaments. Represent your year level!",
    isFeatured: true,
    maxAttendees: 400,
    registered: 290,
  },
];

const typeColors: Record<string, string> = {
  competition: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  meeting: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  workshop: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  seminar: "bg-green-500/20 text-green-400 border-green-500/30",
};

const featured = upcomingEvents.filter((e) => e.isFeatured);
const regular = upcomingEvents.filter((e) => !e.isFeatured);

export default function EventsPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Events & Calendar
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Stay updated with upcoming CICT events and activities
          </p>
        </div>

        {/* Featured Events */}
        {featured.length > 0 && (
          <div className="space-y-6 mb-12">
            <h2 className="text-xs font-semibold text-gold-400 uppercase tracking-widest flex items-center gap-2">
              <span>⭐</span> Featured Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((event) => (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/5 to-maroon-900/20 p-8 backdrop-blur-sm hover:border-gold-500/40 transition-all"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-[80px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[event.type] || typeColors.seminar}`}
                      >
                        {event.typeLabel}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400 border border-gold-400/30">
                        Featured
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-white/60 mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Calendar className="w-4 h-4 text-gold-500/70" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Clock className="w-4 h-4 text-gold-500/70" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <MapPin className="w-4 h-4 text-gold-500/70" />
                        {event.location}
                      </div>
                    </div>

                    {/* Capacity */}
                    {event.maxAttendees && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white/40">
                            <Users className="w-3 h-3 inline mr-1" />
                            {event.registered} registered
                          </span>
                          <span className="text-gold-400 font-medium">
                            {event.maxAttendees - event.registered} spots left
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                            style={{
                              width: `${(event.registered / event.maxAttendees) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 text-sm"
                    >
                      Register Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            All Upcoming Events
          </h2>
          {regular.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.06] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Date Badge */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-900 border border-white/10">
                  <span className="text-[10px] font-bold text-gold-500 uppercase leading-none">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-xl font-bold text-white leading-none mt-0.5">
                    {event.date.split(" ")[1]?.replace(",", "") || "—"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[event.type] || typeColors.seminar}`}
                    >
                      {event.typeLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/50 mt-1">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="flex-shrink-0 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {upcomingEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl text-white/60">No upcoming events</h3>
            <p className="text-white/40 mt-2">Check back later for updates</p>
          </div>
        )}
      </div>
    </PublicPageLayout>
  );
}
