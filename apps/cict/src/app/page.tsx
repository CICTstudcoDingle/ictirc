import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Lightbulb, Users, Laptop, Trophy, ExternalLink, Globe, Store, BookOpen } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { StatsCounter } from "@/components/home/stats-counter";
import { ProgramsOverview } from "@/components/home/programs-overview";
import { totalEnrolled, totalSections } from "@/data/students";
import { totalAlumni } from "@/data/alumni";
import { totalFaculty } from "@/data/faculty";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "College of Information and Communication Technology",
    "alternateName": "CICT",
    "url": "https://isufstcict.com",
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "Iloilo State University of Fisheries Science and Technology",
      "alternateName": "ISUFST",
      "url": "https://isufst.edu.ph",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "San Matias",
      "addressLocality": "Dingle",
      "addressRegion": "Iloilo",
      "postalCode": "5035",
      "addressCountry": "PH",
    },
  };

  const stats = [
    { label: "Students Enrolled", value: totalEnrolled },
    { label: "Active Sections", value: totalSections },
    { label: "Faculty Members", value: totalFaculty },
    { label: "Alumni Graduates", value: totalAlumni, suffix: "+" },
  ];

  return (
    <div className="pt-14 md:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ================================================
          HERO SECTION - Dark with Circuit Texture
          ================================================ */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-20 md:py-28 lg:py-36 overflow-hidden">
        <CircuitBackground variant="default" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column - Main Details */}
            <div className="lg:col-span-7">
              {/* Logos Row */}
              <ScrollAnimation direction="up" delay={0.2}>
                <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 flex-wrap">
                  <Image
                    src="/images/CICT_LOGO.png"
                    alt="CICT Logo"
                    width={100}
                    height={100}
                    className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                  />
                  <Image
                    src="/images/ISUFST_LOGO.png"
                    alt="ISUFST Logo"
                    width={120}
                    height={120}
                    className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                  />
                  <div className="hidden sm:block">
                    <p className="text-lg font-bold text-gold">ISUFST — CICT</p>
                    <p className="text-sm text-gray-400">Dingle Campus, Iloilo</p>
                  </div>
                </div>
              </ScrollAnimation>

              <div className="max-w-3xl">
                <ScrollAnimation direction="up" delay={0.4}>
                  <h1 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-4 md:mb-6">
                    College of Information and{" "}
                    <span className="text-gold">Communication Technology</span>
                  </h1>
                </ScrollAnimation>
                <ScrollAnimation direction="up" delay={0.6}>
                  <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl">
                    Empowering the next generation of IT professionals through cutting-edge education,
                    research, and innovation. Join the premier ICT department at ISUFST Dingle Campus.
                  </p>
                </ScrollAnimation>

                {/* Desktop buttons */}
                <ScrollAnimation direction="up" delay={0.8}>
                  <div className="hidden sm:flex flex-wrap gap-4">
                    <Link href="/programs">
                      <Button variant="gold" size="lg">
                        Explore Programs
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        About CICT
                      </Button>
                    </Link>
                  </div>
                </ScrollAnimation>

                {/* Mobile CTA */}
                <ScrollAnimation direction="up" delay={0.8}>
                  <div className="sm:hidden">
                    <Link href="/programs">
                      <Button variant="gold" size="lg" className="w-full">
                        Explore Programs
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            </div>

            {/* Right Column - Glassmorphic Link Card */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto">
              <ScrollAnimation direction="up" delay={0.6}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-maroon/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <div className="w-2 h-6 bg-gold rounded-full"></div>
                    Quick Portals
                  </h3>
                  
                  <div className="space-y-3 relative z-10">
                    <a
                      href="https://portal.isufstcict.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                          <Globe className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold transition-colors">CICT Tech Portal</p>
                          <p className="text-xs text-gray-400">Main student & faculty portal</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    </a>

                    <a
                      href="https://cictstore.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                          <Store className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold transition-colors">CICT Store</p>
                          <p className="text-xs text-gray-400">Merchandise & uniforms</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    </a>

                    <a
                      href="https://gradeportal.isufstcict.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                          <GraduationCap className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold transition-colors">Grade Portal</p>
                          <p className="text-xs text-gray-400">Student academic records</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    </a>

                    <a
                      href="https://irjict.isufstcict.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                          <BookOpen className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-gold transition-colors">IRJICT</p>
                          <p className="text-xs text-gray-400">Research Journal</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
                    </a>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================
          STATS SECTION - Animated Counters
          ================================================ */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <StatsCounter stats={stats} />
          </ScrollAnimation>
        </div>
      </section>

      {/* ================================================
          PROGRAMS OVERVIEW
          ================================================ */}
      <ProgramsOverview />

      {/* ================================================
          WHY CHOOSE CICT - Feature Cards
          ================================================ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Why Choose CICT?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Discover what makes the College of ICT at ISUFST Dingle Campus the right choice for your future
            </p>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: <Laptop className="w-6 h-6 md:w-7 md:h-7 text-maroon" />,
                title: "Industry-Ready Skills",
                description: "Curriculum aligned with industry standards and hands-on training with modern technologies",
                accent: "maroon",
              },
              {
                icon: <Lightbulb className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />,
                title: "Research-Driven",
                description: "Active research culture with opportunities to publish in our own IRJICT research journal",
                accent: "gold",
              },
              {
                icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-maroon" />,
                title: "Expert Faculty",
                description: "Learn from experienced educators with advanced degrees and industry experience",
                accent: "maroon",
              },
              {
                icon: <Trophy className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />,
                title: "Proven Track Record",
                description: "Graduates excelling in top tech companies and pursuing advanced studies worldwide",
                accent: "gold",
              },
            ].map((feature, index) => (
              <ScrollAnimation key={feature.title} direction="up" staggerIndex={index} className="h-full">
                <div className={`paper-card p-5 md:p-6 text-center hover:shadow-lg transition-all ${feature.accent === "gold" ? "hover:border-gold/40" : "hover:border-maroon/30"} h-full`}>
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${feature.accent === "gold" ? "bg-gold/20" : "bg-maroon/10"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          CTA SECTION - Dark with Circuit Texture
          ================================================ */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-gray-900 via-[#4a0000] to-gray-900 overflow-hidden">
        <CircuitBackground variant="subtle" animated />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Start Your Journey in ICT
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join hundreds of students who are building their future in Information and Communication Technology
              at ISUFST CICT. Explore our programs and discover your path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs">
                <Button variant="gold" size="lg">
                  View Programs
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about#contact">
                <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Contact Us
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
