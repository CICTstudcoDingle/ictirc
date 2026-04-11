import Link from "next/link";
import { ArrowRight, Code, Cpu, Monitor } from "lucide-react";
import { Button } from "@ictirc/ui";
import { programsData } from "@/data/programs";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const programIcons: Record<string, React.ReactNode> = {
  BSIT: <Monitor className="w-8 h-8 text-maroon" />,
  BSCS: <Code className="w-8 h-8 text-maroon" />,
  ACT: <Cpu className="w-8 h-8 text-maroon" />,
};

export function ProgramsOverview() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Academic Programs
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Preparing the next generation of IT professionals with industry-aligned curricula and hands-on training
          </p>
        </ScrollAnimation>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programsData.map((program, index) => (
            <ScrollAnimation key={program.code} direction="up" staggerIndex={index} className="h-full">
              <div className="paper-card p-6 md:p-8 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="w-14 h-14 bg-maroon/10 rounded-xl flex items-center justify-center mb-4">
                  {programIcons[program.code]}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gold font-semibold bg-gold/10 px-2 py-0.5 rounded">
                    {program.code}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{program.duration}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {program.fullName}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">
                  {program.description.slice(0, 150)}...
                </p>
                <Link href="/programs" className="inline-flex items-center gap-1 text-sm font-medium text-maroon hover:text-maroon-600 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation direction="up" delay={0.6} className="text-center mt-8">
          <Link href="/programs">
            <Button variant="secondary" size="lg">
              View All Programs
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </ScrollAnimation>
      </div>
    </section>
  );
}
