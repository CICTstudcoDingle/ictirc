import { Award, Quote } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { totalAlumni, alumniTestimonials, alumniBatches, alumniByYear } from "@/data/alumni";

export default function AlumniPage() {
  const years = Object.keys(alumniByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Alumni</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Celebrating BSIT graduates making their mark across the industry
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-mono text-gold mt-6">
              <Award className="w-4 h-4" />
              <span>{totalAlumni}+ BSIT Graduates</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Graduates by Year — Card Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Graduates by Year
            </h2>
            <p className="text-sm text-gray-500">BSIT graduates per academic year</p>
          </ScrollAnimation>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {years.map((year, index) => (
              <ScrollAnimation key={year} direction="up" staggerIndex={index}>
                <div className="stat-card">
                  <p className="text-xs font-mono text-gray-400 mb-1">Batch</p>
                  <p className="text-lg font-bold text-maroon font-mono">{year}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {alumniByYear[year]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">graduates</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Graduate Summary
            </h2>
          </ScrollAnimation>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Year
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Program
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Graduates
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {alumniBatches
                  .slice()
                  .sort((a, b) => b.year - a.year)
                  .map((batch) => (
                    <tr key={batch.year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-mono text-sm font-semibold text-gray-900">
                        {batch.year}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className="inline-block text-xs font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                          BSIT
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-sm text-maroon font-bold">
                        {batch.graduates}
                      </td>
                    </tr>
                  ))}
                <tr className="bg-maroon/5 border-t-2 border-maroon/20">
                  <td className="px-6 py-3 font-bold text-maroon text-sm" colSpan={2}>
                    GRAND TOTAL
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-sm font-bold text-maroon">
                    {totalAlumni}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Alumni Voices
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Hear from CICT graduates making their mark in the industry
            </p>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniTestimonials.map((testimonial, index) => (
              <ScrollAnimation key={index} direction="up" staggerIndex={index} className="h-full">
                <div className="paper-card p-6 hover:shadow-lg transition-all h-full flex flex-col">
                  <Quote className="w-8 h-8 text-gold/40 mb-4" />
                  <p className="text-sm text-gray-600 italic flex-1 mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-maroon font-mono">
                      {testimonial.program} — Batch {testimonial.batch}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
