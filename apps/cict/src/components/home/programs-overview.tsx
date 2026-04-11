import Link from "next/link";
import { ArrowRight, Monitor } from "lucide-react";
import { Button } from "@ictirc/ui";
import { programsData } from "@/data/programs";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export function ProgramsOverview() {
  const program = programsData[0];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Academic Program
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            A rigorous four-year degree designed to produce industry-ready IT professionals
          </p>
        </ScrollAnimation>

        {/* Full-width featured program card */}
        <ScrollAnimation direction="up">
          <div className="paper-card p-8 md:p-10 hover:shadow-xl transition-all">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon & Badge */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-maroon/10 rounded-2xl flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-maroon" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-mono font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {program.code}
                  </span>
                  <span className="text-sm text-gray-500 font-mono">{program.duration}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {program.fullName}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6 max-w-3xl">
                  {program.description.slice(0, 250)}...
                </p>

                {/* Specializations & Highlights */}
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {program.specializations.map((s) => (
                        <span key={s.name} className="px-3 py-1 bg-maroon/5 text-maroon text-xs font-bold rounded-full border border-maroon/10">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Core Highlights
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {program.highlights.slice(0, 4).map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href="/programs">
                  <Button variant="primary" size="lg">
                    View Full Curriculum
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
