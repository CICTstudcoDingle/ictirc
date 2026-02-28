import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Mic2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@ictirc/database";
import { CircuitBackground } from "@ictirc/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const conference = await prisma.conference.findUnique({
    where: { id, isPublished: true },
    select: { name: true, fullName: true },
  });

  if (!conference) return { title: "Conference Not Found | ICTIRC" };

  return {
    title: `Keynote Speakers – ${conference.fullName ?? conference.name} | ICTIRC`,
    description: `Meet the distinguished keynote speakers of ${conference.fullName ?? conference.name}.`,
  };
}

export default async function ConferenceSpeakersPage({ params }: PageProps) {
  const { id } = await params;

  const conference = await prisma.conference.findUnique({
    where: { id, isPublished: true },
    select: {
      id: true,
      name: true,
      fullName: true,
      startDate: true,
      endDate: true,
      speakers: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!conference) {
    notFound();
  }

  const { speakers } = conference;

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#800000] via-[#4a0000] to-[#800000] overflow-hidden">
        <CircuitBackground variant="default" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-22 text-center">
          {/* Back link */}
          <div className="flex justify-start mb-8">
            <Link
              href={`/conferences/${conference.id}`}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Conference
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold">
            <Mic2 className="w-4 h-4" />
            Keynote Speakers
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Distinguished <span className="text-gold">Speakers</span>
          </h1>

          {/* Conference name banner */}
          <Link
            href={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-5 py-3 mt-4 transition-colors group text-sm"
          >
            <Calendar className="w-4 h-4 text-gold shrink-0" />
            <span className="font-medium">
              {conference.fullName ?? conference.name}
            </span>
            {conference.startDate && (
              <span className="text-gray-300 text-xs hidden sm:inline">
                · {formatDate(conference.startDate)}
              </span>
            )}
          </Link>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {speakers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Mic2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No speakers announced yet.</p>
              <p className="text-sm mt-1">Check back soon!</p>
              <Link
                href={`/conferences/${conference.id}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-maroon hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Conference Details
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {speakers.map((speaker) => (
                <Link
                  key={speaker.id}
                  href={`/speakers/${speaker.id}`}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-maroon/20 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Photo */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-maroon/5 to-gold/5 overflow-hidden">
                    {speaker.photoUrl ? (
                      <Image
                        src={speaker.photoUrl}
                        alt={speaker.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-maroon/10 flex items-center justify-center">
                          <span className="text-maroon font-bold text-3xl md:text-4xl">
                            {speaker.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    {/* Conference badge */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-maroon bg-maroon/10 rounded-full px-2.5 py-0.5 mb-3 self-start">
                      <Calendar className="w-3 h-3" />
                      {conference.name}
                    </span>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-maroon transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-sm font-medium text-maroon/80 mb-2">
                      {speaker.position}
                    </p>
                    {speaker.affiliation && (
                      <p className="text-sm text-gray-600 mb-1">
                        {speaker.affiliation}
                      </p>
                    )}
                    {speaker.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{speaker.location}</span>
                      </div>
                    )}
                    {speaker.bio && (
                      <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                        {speaker.bio}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-maroon via-gold to-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
