import { Code, Monitor, Cpu, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { programsData } from "@/data/programs";

const programIcons: Record<string, React.ReactNode> = {
  BSIT: <Monitor className="w-10 h-10 text-maroon" />,
  BSCS: <Code className="w-10 h-10 text-maroon" />,
  ACT: <Cpu className="w-10 h-10 text-maroon" />,
};

export default function ProgramsPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Academic <span className="text-gold">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Industry-aligned curricula designed to prepare you for the future of technology
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          {programsData.map((program, index) => (
            <ScrollAnimation key={program.code} direction={index % 2 === 0 ? "right" : "left"}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Program Header */}
                <div className="bg-gradient-to-r from-maroon/5 to-gold/5 p-6 md:p-8 border-b border-gray-100">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-16 h-16 bg-maroon/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {programIcons[program.code]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                          {program.code}
                        </span>
                        <span className="text-sm text-gray-500 font-mono">{program.duration}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {program.fullName}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Program Body */}
                <div className="p-6 md:p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {program.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Curriculum Highlights */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-maroon" />
                        Curriculum Highlights
                      </h3>
                      <ul className="space-y-2.5">
                        {program.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2 text-sm text-gray-600">
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
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>
    </div>
  );
}
