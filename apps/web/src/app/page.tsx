import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@ictirc/ui";

export default function HomePage() {
  return (
    <div className="pt-14 md:pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-maroon/5 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Logos Badge */}
            <div className="flex items-center gap-3 mb-6">
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
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-maroon">ISUFST - CICT</p>
                <p className="text-xs text-gray-500">Dingle Campus</p>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6">
              Information & Communication Technology{" "}
              <span className="text-maroon">International Research Conference</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl">
              A scholarly publication platform dedicated to advancing ICT research
              and innovation. Browse peer-reviewed papers, submit your research,
              and join our academic community.
            </p>
            {/* Desktop buttons */}
            <div className="hidden sm:flex flex-wrap gap-4">
              <Link href="/archive">
                <Button size="lg">
                  Browse Archive
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="secondary" size="lg">
                  Submit Paper
                </Button>
              </Link>
            </div>
            {/* Mobile single button */}
            <div className="sm:hidden">
              <Link href="/archive">
                <Button size="lg" className="w-full">
                  Browse Archive
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative element - hidden on mobile */}
        <div className="hidden md:block absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-maroon/5 to-transparent pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-maroon">500+</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Published Papers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-maroon">200+</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Researchers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-maroon">15+</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-gold">2024</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Publish With Us?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              ICTIRC provides a rigorous peer-review process and global visibility
              for your ICT research.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            <Link href="/about" className="paper-card p-4 md:p-6 hover:border-maroon/30 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-maroon/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-maroon" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peer-Reviewed</h3>
              <p className="text-sm text-gray-600">
                All submissions undergo rigorous double-blind peer review by
                experts in the field.
              </p>
            </Link>
            <Link href="/about" className="paper-card p-4 md:p-6 hover:border-maroon/30 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">DOI Assigned</h3>
              <p className="text-sm text-gray-600">
                Every published paper receives a unique Digital Object Identifier
                for permanent citation.
              </p>
            </Link>
            <Link href="/about" className="paper-card p-4 md:p-6 hover:border-maroon/30 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-maroon/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-maroon" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Global Visibility</h3>
              <p className="text-sm text-gray-600">
                Papers are indexed on Google Scholar and major academic databases
                for maximum reach.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Ready to Submit Your Research?
          </h2>
          <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join hundreds of researchers who have published their ICT innovations
            with ICTIRC. Start your submission today.
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
