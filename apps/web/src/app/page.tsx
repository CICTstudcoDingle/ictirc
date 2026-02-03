import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, FileCheck, Zap } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { UpcomingEventCard } from "@/components/events/upcoming-event-card";
import { ParticipatingUniversities } from "@/components/home/participating-universities";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "2nd ICT International Research Conference",
    "startDate": "2026-03-03T08:00:00+08:00",
    "endDate": "2026-03-05T17:00:00+08:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Knowledge Management Hub, ISUFST Dingle Campus",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "San Matias",
        "addressLocality": "Dingle",
        "addressRegion": "Iloilo",
        "postalCode": "5035",
        "addressCountry": "PH"
      }
    },
    "description": "The 2nd ICT International Research Conference 2026 organized by the College of Information and Computing Technology.",
    "organizer": {
      "@type": "Organization",
      "name": "ISUFST - College of Information and Computing Technology",
      "url": "https://ictirc.isufst.edu.ph"
    }
  };

  return (
    <div className="pt-14 md:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-16 md:py-24 lg:py-32 overflow-hidden">
        <CircuitBackground variant="default" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logos Badge - Outside max-w-3xl to allow full width horizontal alignment */}
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 flex-wrap">
              <Image
                src="/images/irjict-logo.png"
                alt="IRJICT Logo"
                width={120}
                height={120}
                className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl bg-white/10 p-1.5 md:p-2 backdrop-blur-sm object-contain"
              />
              <Image
                src="/images/CICT_LOGO.png"
                alt="CICT Logo"
                width={100}
                height={100}
                className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
              />
              <Image
                src="/images/ISUFST_LOGO.png"
                alt="ISUFST Logo"
                width={120}
                height={120}
                className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
              />
              <div className="hidden sm:block">
                <p className="text-lg font-bold text-gold">ISUFST - CICT</p>
                <p className="text-sm text-gray-400">Dingle Campus</p>
              </div>

              <Image
                src="/images/UB LOGO (1).png"
                alt="Universitas Brawijaya Logo"
                width={100}
                height={100}
                className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gold">Partner University</p>
                <p className="text-base text-gray-400">Universitas Brawijaya</p>
              </div>
            </div>
          </ScrollAnimation>

          <div className="max-w-3xl">
            <ScrollAnimation direction="up" delay={0.4}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 md:mb-6">
                International Research Journal on <span className="text-gold">Information and Communications Technology</span>
              </h1>
            </ScrollAnimation>
            <ScrollAnimation direction="up" delay={0.6}>
              <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl">
                A scholarly publication platform dedicated to advancing ICT research
                and innovation. Browse peer-reviewed papers, submit your research,
                and join our academic community.
              </p>
            </ScrollAnimation>
            {/* Desktop buttons */}
            <ScrollAnimation direction="up" delay={0.8}>
              <div className="hidden sm:flex flex-wrap gap-4">
                <Link href="/archive">
                  <Button variant="gold" size="lg">
                    Browse Archive
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Submit Paper
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
            {/* Mobile single button */}
            <ScrollAnimation direction="up" delay={0.8}>
              <div className="sm:hidden">
                <Link href="/archive">
                  <Button variant="gold" size="lg" className="w-full">
                    Browse Archive
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
            
            {/* Mobile Upcoming Event Banner - only shows on mobile */}
            <div className="lg:hidden">
              <UpcomingEventCard />
            </div>
          </div>
          
          {/* Desktop Floating Event Card - positioned absolutely within hero, hidden on mobile */}
          <div className="hidden lg:block">
            <UpcomingEventCard />
          </div>
        </div>
      </section>

      {/* Participating Universities Marquee */}
      <ParticipatingUniversities />

      {/* Why Publish With Us - Merged Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Publish With Us?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Advancing ICT research in the Philippines through rigorous standards and global reach
            </p>
          </ScrollAnimation>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Rigorous Peer Review */}
            <ScrollAnimation direction="up" staggerIndex={0} className="h-full">
              <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-maroon/30 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-maroon" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                  Rigorous Peer Review
                </h3>
                <p className="text-sm text-gray-600">
                  Double-blind review by field experts ensuring the highest quality standards
                </p>
              </div>
            </ScrollAnimation>

            {/* DOI Assignment */}
            <ScrollAnimation direction="up" staggerIndex={1} className="h-full">
              <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-gold/40 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                  DOI Assignment
                </h3>
                <p className="text-sm text-gray-600">
                  Permanent digital identifier for citations and academic credibility
                </p>
              </div>
            </ScrollAnimation>

            {/* Global Indexing */}
            <ScrollAnimation direction="up" staggerIndex={2} className="h-full">
              <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-maroon/30 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-maroon" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                  Global Indexing
                </h3>
                <p className="text-sm text-gray-600">
                  Listed on Google Scholar and major academic databases for maximum reach
                </p>
              </div>
            </ScrollAnimation>

            {/* Fast Publication */}
            <ScrollAnimation direction="up" staggerIndex={3} className="h-full">
              <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-gold/40 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                  Fast Publication
                </h3>
                <p className="text-sm text-gray-600">
                  Average 30-day review cycle from submission to decision
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark with Circuit Texture */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-gray-900 via-[#4a0000] to-gray-900 overflow-hidden">
        <CircuitBackground variant="subtle" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Ready to Submit Your Research?
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join hundreds of researchers who have published their ICT innovations
              with IRJICT. Start your submission today.
            </p>
            <Link href="/submit">
              <Button variant="gold" size="lg">
                Start Submission
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
