import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, FileCheck, Zap } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { UpcomingEventCard } from "@/components/events/upcoming-event-card";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="pt-14 md:pt-16">
      {/* Hero Section - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-16 md:py-24 lg:py-32 overflow-hidden">
        <CircuitBackground variant="default" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Logos Badge */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <Image
                src="/images/irjict-logo.png"
                alt="IRJICT Logo"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 p-1 backdrop-blur-sm"
              />
              <Image
                src="/images/CICT_LOGO.png"
                alt="CICT Logo"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <Image
                src="/images/ISUFST_LOGO.png"
                alt="ISUFST Logo"
                width={64}
                height={64}
                className="w-14 h-14 md:w-16 md:h-16"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gold">ISUFST - CICT</p>
                <p className="text-xs text-gray-400">Dingle Campus</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Image
                  src="/images/UB LOGO (1).png"
                  alt="Universitas Brawijaya Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 md:w-12 md:h-12"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-gold">Partner University</p>
                  <p className="text-xs text-gray-400">Universitas Brawijaya</p>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 md:mb-6">
              International Research Journal on <span className="text-gold">Information and Communications Technology</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl">
              A scholarly publication platform dedicated to advancing ICT research
              and innovation. Browse peer-reviewed papers, submit your research,
              and join our academic community.
            </p>
            {/* Desktop buttons */}
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
            {/* Mobile single button */}
            <div className="sm:hidden">
              <Link href="/archive">
                <Button variant="gold" size="lg" className="w-full">
                  Browse Archive
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
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

      {/* Why Publish With Us - Merged Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Publish With Us?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Advancing ICT research in the Philippines through rigorous standards and global reach
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Rigorous Peer Review */}
            <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-maroon/30">
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

            {/* DOI Assignment */}
            <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-gold/40">
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

            {/* Global Indexing */}
            <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-maroon/30">
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

            {/* Fast Publication */}
            <div className="paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all hover:border-gold/40">
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
          </div>
        </div>
      </section>

      {/* CTA Section - Dark with Circuit Texture */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-gray-900 via-[#4a0000] to-gray-900 overflow-hidden">
        <CircuitBackground variant="subtle" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>
      </section>
    </div>
  );
}
