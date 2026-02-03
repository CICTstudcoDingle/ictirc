import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { prisma } from "@ictirc/database";
import { Button, CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conferences & Events | ICTIRC",
  description: "Academic conferences and events hosted by the ISUFST College of Information and Computing Technology.",
};

interface Conference {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isPublished: boolean;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(startDate: Date, endDate: Date | null): string {
  const start = formatDate(startDate);
  if (!endDate) return start;
  
  const end = formatDate(endDate);
  if (start === end) return start;
  
  return `${start} - ${end}`;
}

function getDaysUntil(date: Date): number {
  const now = new Date();
  return Math.ceil((new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function ConferenceCard({ conference, isPast }: { conference: Conference; isPast: boolean }) {
  const daysUntil = getDaysUntil(conference.startDate);
  const showCountdown = !isPast && daysUntil > 0 && daysUntil <= 30;

  return (
    <Link href={`/conferences/${conference.id}`}>
      <div
        className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
          isPast ? "opacity-60 hover:opacity-80" : "hover:border-maroon/30"
        }`}
      >
        {/* Image */}
        {conference.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={conference.imageUrl}
              alt={conference.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {showCountdown && (
              <div className="absolute top-3 right-3 bg-gold text-maroon px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {daysUntil} days remaining
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {!conference.imageUrl && showCountdown && (
            <div className="inline-flex items-center gap-1 bg-gold/20 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Clock className="w-4 h-4" />
              {daysUntil} days remaining
            </div>
          )}

          <h3 className={`text-xl font-bold mb-2 group-hover:text-maroon transition-colors ${isPast ? "text-gray-600" : "text-gray-900"}`}>
            {conference.name}
          </h3>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDateRange(conference.startDate, conference.endDate)}
            </div>
            {conference.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {conference.location}
              </div>
            )}
          </div>

          {conference.description && (
            <p className={`line-clamp-2 mb-4 ${isPast ? "text-gray-500" : "text-gray-600"}`}>
              {conference.description}
            </p>
          )}

          <div className="flex items-center text-maroon font-medium group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ConferencesPage() {
  const now = new Date();

  const conferences = await prisma.conference.findMany({
    where: { isPublished: true },
    orderBy: { startDate: "desc" },
  });

  const upcoming = conferences
    .filter((conference) => new Date(conference.startDate) >= now)
    .sort((a: Conference, b: Conference) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const past = conferences.filter((conference) => new Date(conference.startDate) < now);

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-16 md:py-20 overflow-hidden">
        <CircuitBackground variant="default" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Conferences & <span className="text-gold">Events</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join us at academic conferences and events hosted by the ISUFST College of Information and Communications Technology.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Events Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-4 h-4 rounded-full bg-gold animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <span className="bg-gold/20 text-amber-800 px-2 py-0.5 rounded-full text-sm font-medium">
                {upcoming.length}
              </span>
            </div>

            <div className="relative pl-8 border-l-2 border-gold/30 space-y-8">
              {upcoming.map((conference: Conference, index: number) => (
                <ScrollAnimation key={conference.id} direction="up" staggerIndex={index}>
                  <div className="relative">
                    <div className="absolute -left-[2.45rem] w-4 h-4 rounded-full bg-gold border-4 border-white" />
                    <ConferenceCard conference={conference} isPast={false} />
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-4 h-4 rounded-full bg-gray-300" />
              <h2 className="text-2xl font-bold text-gray-600">Past Events</h2>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm font-medium">
                {past.length}
              </span>
            </div>

            <div className="relative pl-8 border-l-2 border-gray-200 space-y-8">
              {past.map((conference: Conference, index: number) => (
                <ScrollAnimation key={conference.id} direction="up" staggerIndex={index}>
                  <div className="relative">
                    <div className="absolute -left-[2.45rem] w-4 h-4 rounded-full bg-gray-300 border-4 border-white" />
                    <ConferenceCard conference={conference} isPast={true} />
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {conferences.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-6">
              Check back soon for upcoming conferences and events.
            </p>
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
