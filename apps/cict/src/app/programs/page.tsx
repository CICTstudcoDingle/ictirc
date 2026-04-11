import { Monitor, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { programsData } from "@/data/programs";
import { totalEnrolled, totalSections } from "@/data/students";

export default function ProgramsPage() {
  const program = programsData[0];

  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Academic <span className="text-gold">Program</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Bachelor of Science in Information Technology
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <span>{program.duration} Program</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <span>{totalSections} Sections</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <span>{totalEnrolled} Students Enrolled</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Program Detail */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollAnimation direction="up">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Program Header */}
              <div className="bg-gradient-to-r from-maroon/5 to-gold/5 p-6 md:p-10 border-b border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-maroon/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-10 h-10 text-maroon" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                        {program.code}
                      </span>
                      <span className="text-sm text-gray-500 font-mono">{program.duration}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {program.fullName}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Program Body */}
              <div className="p-6 md:p-10">
                <p className="text-gray-600 leading-relaxed text-base mb-10">
                  {program.description}
                </p>

                {/* Specializations Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-maroon rounded-full" />
                    Specialized Tracks
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {program.specializations.map((spec) => (
                      <div key={spec.name} className="p-5 rounded-xl border border-gold/20 bg-gold/5 hover:border-gold/40 transition-colors">
                        <h4 className="font-bold text-gray-900 mb-2 font-mono text-sm uppercase tracking-wider">{spec.name}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Curriculum Highlights */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-maroon" />
                      Curriculum Highlights
                    </h3>
                    <ul className="space-y-3">
                      {program.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Opportunities */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Briefcase className="w-5 h-5 text-maroon" />
                      Career Opportunities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {program.careers.map((career) => (
                        <span
                          key={career}
                          className="inline-block px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-maroon/10 hover:text-maroon transition-colors"
                        >
                          {career}
                        </span>
                      ))}
                    </div>

                    {/* Enrollment stats */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="bg-maroon/5 rounded-xl p-4 text-center border border-maroon/10">
                        <p className="text-3xl font-bold text-maroon">{totalEnrolled}</p>
                        <p className="text-xs text-gray-500 mt-1">Students Enrolled</p>
                        <p className="text-[10px] font-mono text-gray-400">AY 2025-2026</p>
                      </div>
                      <div className="bg-gold/10 rounded-xl p-4 text-center border border-gold/20">
                        <p className="text-3xl font-bold text-amber-700">{totalSections}</p>
                        <p className="text-xs text-gray-500 mt-1">Active Sections</p>
                        <p className="text-[10px] font-mono text-gray-400">1A–4B</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
