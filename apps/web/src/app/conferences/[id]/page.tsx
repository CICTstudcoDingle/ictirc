import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { prisma } from "@ictirc/database";
import { Button, CircuitBackground } from "@ictirc/ui";
import { ShareButton } from "@/components/events/share-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const conference = await prisma.conference.findUnique({
    where: { id },
  });

  if (!conference) {
    return { title: "Conference Not Found | ICTIRC" };
  }

  const description = conference.description?.slice(0, 160) || conference.name;

  return {
    title: `${conference.fullName || conference.name} | ICTIRC Conferences`,
    description,
    openGraph: {
      title: conference.fullName || conference.name,
      description,
      type: "article",
      ...(conference.imageUrl && { images: [conference.imageUrl] }),
    },
  };
}

function formatDate(date: Date): string {
  // Use UTC methods to avoid timezone shifts
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC", // Force UTC to match database storage
  });
}

function formatDateRange(startDate: Date, endDate: Date | null): string {
  const start = formatDate(startDate);
  if (!endDate) return start;

  const end = formatDate(endDate);
  if (start === end) return start;

  return `${start} — ${end}`;
}

export default async function ConferenceDetailPage({ params }: PageProps) {
  const { id } = await params;

  const conference = await prisma.conference.findUnique({
    where: { id, isPublished: true },
  });

  if (!conference) {
    notFound();
  }

  const now = new Date();
  const startDate = new Date(conference.startDate);
  const isUpcoming = startDate >= now;
  const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const showCountdown = isUpcoming && daysUntil > 0 && daysUntil <= 30;

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#800000] via-[#4a0000] to-[#800000] overflow-hidden">
        <CircuitBackground variant="default" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Back Button */}
          <Link
            href="/conferences"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {isUpcoming ? (
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                Upcoming
              </span>
            ) : (
              <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                Past Event
              </span>
            )}
            {showCountdown && (
              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {daysUntil} days remaining
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {conference.fullName || conference.name}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span>{formatDateRange(conference.startDate, conference.endDate)}</span>
            </div>
            {conference.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span>{conference.location}</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="mb-8">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://ictirc.com'}/conferences/${conference.id}`}
              title={conference.name}
              description={conference.description?.slice(0, 160) || conference.name}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
          {/* Description */}
          {conference.description && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {conference.description}
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className={conference.description ? "mt-10 space-y-6" : "space-y-6"}>
            {conference.venue && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue</h3>
                <p className="text-gray-600">{conference.venue}</p>
              </div>
            )}

            {conference.theme && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Theme</h3>
                <p className="text-gray-600">{conference.theme}</p>
              </div>
            )}

            {conference.organizers && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizers</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{conference.organizers}</p>
              </div>
            )}

            {conference.partners && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Partners</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{conference.partners}</p>
              </div>
            )}

            {(conference.websiteUrl || conference.logoUrl) && (
              <div className="flex flex-wrap gap-4 items-center">
                {conference.websiteUrl && (
                  <a
                    href={conference.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#800000] hover:text-[#600000] font-medium transition-colors"
                  >
                    Visit Official Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {conference.logoUrl && (
                  <div className="relative h-16 w-auto">
                    <Image
                      src={conference.logoUrl}
                      alt="Conference Logo"
                      height={64}
                      width={120}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Image (if exists, show full size) */}
          {conference.imageUrl && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Banner</h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={conference.imageUrl}
                  alt={conference.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
            <Link href="/conferences">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4" />
                All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
