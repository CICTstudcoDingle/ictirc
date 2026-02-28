import Link from "next/link";
import Image from "next/image";
import { Mic2, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@ictirc/database";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export async function KeynoteSpeakers() {
  // Fetch speakers from the active conference
  const conference = await prisma.conference.findFirst({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      speakers: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  // Fallback to latest published conference
  const data =
    conference ||
    (await prisma.conference.findFirst({
      where: { isPublished: true },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        name: true,
        speakers: {
          orderBy: { displayOrder: "asc" },
        },
      },
    }));

  if (!data || !data.speakers || data.speakers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-maroon/10 text-maroon rounded-full px-4 py-1.5 mb-4 text-sm font-semibold">
            <Mic2 className="w-4 h-4" />
            Keynote Speakers
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Distinguished <span className="text-gold">Speakers</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Leading experts sharing insights and innovations in Information and Communications Technology
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.speakers.map((speaker, index) => (
            <ScrollAnimation
              key={speaker.id}
              direction="up"
              staggerIndex={index}
              className="h-full"
            >
              <Link
                href={`/speakers/${speaker.id}`}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-maroon/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Photo Section */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-maroon/5 to-gold/5 overflow-hidden">
                  {speaker.photoUrl ? (
                    <Image
                      src={speaker.photoUrl}
                      alt={speaker.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                  {/* Gradient overlay at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
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
                      <MapPin className="w-3.5 h-3.5" />
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

                {/* Bottom Gold Accent Bar */}
                <div className="h-1 bg-gradient-to-r from-maroon via-gold to-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 bg-maroon text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-maroon/90 transition-colors"
          >
            View All Speakers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
