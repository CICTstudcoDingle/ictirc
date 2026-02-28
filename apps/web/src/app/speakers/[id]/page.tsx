import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Mic2,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";
import { prisma } from "@ictirc/database";
import { CircuitBackground } from "@ictirc/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const speaker = await prisma.keynoteSpeaker.findUnique({
    where: { id },
    include: { conference: { select: { name: true } } },
  });

  if (!speaker) return { title: "Speaker Not Found | ICTIRC" };

  return {
    title: `${speaker.name} | Keynote Speakers | ICTIRC`,
    description:
      speaker.bio?.slice(0, 160) ??
      `${speaker.name} – ${speaker.position}${speaker.affiliation ? ` at ${speaker.affiliation}` : ""}`,
    openGraph: {
      title: speaker.name,
      description: speaker.bio?.slice(0, 160) ?? speaker.position,
      type: "profile",
      ...(speaker.photoUrl && { images: [speaker.photoUrl] }),
    },
  };
}

export default async function SpeakerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const speaker = await prisma.keynoteSpeaker.findUnique({
    where: { id },
    include: {
      conference: {
        select: {
          id: true,
          name: true,
          fullName: true,
          startDate: true,
          isPublished: true,
        },
      },
    },
  });

  if (!speaker || !speaker.conference.isPublished) {
    notFound();
  }

  const { conference } = speaker;

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#800000] via-[#4a0000] to-[#800000] overflow-hidden">
        <CircuitBackground variant="default" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-300 mb-8">
            <Link
              href="/speakers"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Speakers
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/conferences/${conference.id}/speakers`}
              className="hover:text-white transition-colors"
            >
              {conference.name} Speakers
            </Link>
          </div>

          {/* Speaker hero card */}
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Photo */}
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden shrink-0 border-4 border-white/20 shadow-xl bg-gradient-to-br from-maroon/10 to-gold/10">
              {speaker.photoUrl ? (
                <Image
                  src={speaker.photoUrl}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, 208px"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white font-bold text-5xl md:text-6xl">
                    {speaker.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Mic2 className="w-3.5 h-3.5" />
                Keynote Speaker
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {speaker.name}
              </h1>
              <p className="text-gold font-semibold text-base md:text-lg mb-3">
                {speaker.position}
              </p>

              <div className="flex flex-col gap-2 text-sm text-gray-300">
                {speaker.affiliation && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gold shrink-0" />
                    <span>{speaker.affiliation}</span>
                  </div>
                )}
                {speaker.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span>{speaker.location}</span>
                  </div>
                )}
              </div>

              {/* Conference link */}
              <Link
                href={`/conferences/${conference.id}`}
                className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-4 py-2 text-sm transition-colors"
              >
                <Calendar className="w-4 h-4 text-gold" />
                {conference.fullName ?? conference.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
            {speaker.bio ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-maroon" />
                  <h2 className="text-xl font-bold text-gray-900">Biography</h2>
                </div>
                <div className="prose prose-base max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {speaker.bio}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">
                Bio coming soon.
              </p>
            )}

            {/* Navigation */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
              <Link
                href="/speakers"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-maroon transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Speakers
              </Link>
              <Link
                href={`/conferences/${conference.id}/speakers`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-maroon transition-colors"
              >
                <Mic2 className="w-4 h-4" />
                {conference.name} Speakers
              </Link>
              <Link
                href={`/conferences/${conference.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-maroon transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Conference Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
