import { Award, Quote, TrendingUp, Users } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { totalAlumni, alumniTestimonials, alumniBatches, alumniByYear } from "@/data/alumni";

export default function AlumniPage() {
  const years = Object.keys(alumniByYear).sort((a, b) => Number(b) - Number(a));

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
              Celebrating the success of CICT graduates making an impact worldwide
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-mono text-gold mt-6">
              <Award className="w-4 h-4" />
              <span>{totalAlumni}+ Graduates and Counting</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Alumni Stats by Year */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Graduates by Year
            </h2>
            <p className="text-sm text-gray-500">
              Total graduates per academic year across all programs
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {years.map((year, index) => (
              <ScrollAnimation key={year} direction="up" staggerIndex={index}>
                <div className="stat-card">
                  <p className="text-xs font-mono text-gray-400 mb-1">Batch</p>
                  <p className="text-lg font-bold text-maroon font-mono">{year}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {alumniByYear[Number(year)]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">graduates</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni by Program */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Graduates by Program
            </h2>
          </ScrollAnimation>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Year
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    BSIT
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    BSCS
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    ACT
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {years.map((year) => {
                  const yearBatches = alumniBatches.filter((b) => b.year === Number(year));
                  const bsit = yearBatches.find((b) => b.program === "BSIT")?.graduates || 0;
                  const bscs = yearBatches.find((b) => b.program === "BSCS")?.graduates || 0;
                  const act = yearBatches.find((b) => b.program === "ACT")?.graduates || 0;

                  return (
                    <tr key={year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 font-mono text-sm font-semibold text-gray-900">{year}</td>
                      <td className="px-4 md:px-6 py-3 text-right font-mono text-sm text-gray-700">{bsit}</td>
                      <td className="px-4 md:px-6 py-3 text-right font-mono text-sm text-gray-700">{bscs}</td>
                      <td className="px-4 md:px-6 py-3 text-right font-mono text-sm text-gray-700">{act}</td>
                      <td className="px-4 md:px-6 py-3 text-right font-mono text-sm text-maroon font-bold">
                        {alumniByYear[Number(year)]}
                      </td>
                    </tr>
                  );
                })}
                {/* Grand total row */}
                <tr className="bg-maroon/5 border-t-2 border-maroon/20">
                  <td className="px-4 md:px-6 py-3 font-bold text-maroon text-sm">GRAND TOTAL</td>
                  <td className="px-4 md:px-6 py-3 text-right font-mono text-sm font-bold text-maroon">
                    {alumniBatches.filter((b) => b.program === "BSIT").reduce((s, b) => s + b.graduates, 0)}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-right font-mono text-sm font-bold text-maroon">
                    {alumniBatches.filter((b) => b.program === "BSCS").reduce((s, b) => s + b.graduates, 0)}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-right font-mono text-sm font-bold text-maroon">
                    {alumniBatches.filter((b) => b.program === "ACT").reduce((s, b) => s + b.graduates, 0)}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-right font-mono text-sm font-bold text-maroon">
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
              Alumni Success Stories
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Hear from CICT graduates who are making their mark in the industry
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
