"use client";

import { useState } from "react";
import { GraduationCap, Users, ChevronDown } from "lucide-react";
import { CircuitBackground, cn } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { enrollmentData, academicYear, totalEnrolled, totalSections } from "@/data/students";

export default function StudentsPage() {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(enrollmentData[0]?.code || null);

  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Student <span className="text-gold">Enrollment</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Academic Year {academicYear} — CICT Department
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <GraduationCap className="w-4 h-4" />
                <span>{totalEnrolled} Total Students</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <Users className="w-4 h-4" />
                <span>{totalSections} Sections</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {enrollmentData.map((program, index) => (
              <ScrollAnimation key={program.code} direction="up" staggerIndex={index}>
                <button
                  onClick={() => setExpandedProgram(expandedProgram === program.code ? null : program.code)}
                  className={cn(
                    "w-full stat-card cursor-pointer text-left",
                    expandedProgram === program.code && "ring-2 ring-maroon shadow-lg"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                      {program.code}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {program.sections.length} sections
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-maroon">{program.totalStudents}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Students</p>
                </button>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Breakdown */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Enrollment by Section
            </h2>
            <p className="text-sm text-gray-500">
              Click on a program above to filter, or expand sections below
            </p>
          </ScrollAnimation>

          <div className="space-y-4">
            {enrollmentData.map((program) => (
              <div key={program.code} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Program Accordion Header */}
                <button
                  onClick={() => setExpandedProgram(expandedProgram === program.code ? null : program.code)}
                  className="w-full flex items-center justify-between p-4 md:p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-maroon" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{program.program}</h3>
                      <p className="text-xs font-mono text-gray-500">
                        {program.code} • {program.totalStudents} students • {program.sections.length} sections
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform",
                      expandedProgram === program.code && "rotate-180"
                    )}
                  />
                </button>

                {/* Sections Table */}
                {expandedProgram === program.code && (
                  <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-100">
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                              Section
                            </th>
                            <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                              Students
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {program.sections.map((section) => (
                            <tr key={section.section} className="hover:bg-white transition-colors">
                              <td className="px-4 md:px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-maroon rounded-full" />
                                  <span className="font-medium text-gray-900 font-mono text-sm">
                                    {section.section}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-3 text-right">
                                <span className="font-mono text-sm text-gray-700 font-semibold">
                                  {section.count}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-maroon/5 border-t-2 border-maroon/20">
                            <td className="px-4 md:px-6 py-3">
                              <span className="font-bold text-maroon text-sm">TOTAL</span>
                            </td>
                            <td className="px-4 md:px-6 py-3 text-right">
                              <span className="font-mono text-sm text-maroon font-bold">
                                {program.totalStudents}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
