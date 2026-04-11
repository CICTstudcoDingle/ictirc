"use client";

import { useState } from "react";
import { GraduationCap, Users, ChevronDown, User } from "lucide-react";
import { CircuitBackground, cn } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import {
  enrollmentData,
  academicYear,
  totalEnrolled,
  totalSections,
  enrollmentByYear,
} from "@/data/students";

export default function StudentsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | "all">("all");

  const program = enrollmentData[0];

  const filteredSections =
    activeYear === "all"
      ? program.sections
      : program.sections.filter((s) => s.yearLevel === activeYear);

  const yearTabs = [
    { label: "All Years", value: "all" as const },
    { label: "1st Year", value: 1 as const },
    { label: "2nd Year", value: 2 as const },
    { label: "3rd Year", value: 3 as const },
    { label: "4th Year", value: 4 as const },
  ];

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
              Academic Year {academicYear} — BSIT Program
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
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

      {/* Year Summary Cards */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(enrollmentByYear).map(([year, count], index) => (
              <ScrollAnimation key={year} direction="up" staggerIndex={index}>
                <button
                  onClick={() => setActiveYear(index + 1 as 1 | 2 | 3 | 4)}
                  className={cn(
                    "w-full stat-card cursor-pointer text-left transition-all",
                    activeYear === index + 1 && "ring-2 ring-maroon shadow-lg"
                  )}
                >
                  <p className="text-xs font-mono text-gray-400 mb-1">{year}</p>
                  <p className="text-3xl font-bold text-maroon">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">students</p>
                </button>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Breakdown */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Year Level Tabs */}
          <ScrollAnimation direction="up" className="mb-8">
            <div className="flex flex-wrap gap-2">
              {yearTabs.map((tab) => (
                <button
                  key={String(tab.value)}
                  onClick={() => {
                    setActiveYear(tab.value);
                    setExpandedSection(null);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeYear === tab.value
                      ? "bg-maroon text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ScrollAnimation>

          {/* Sections Accordion */}
          <div className="space-y-3">
            {filteredSections.map((section) => {
              const maleCount = section.students.filter((s) => s.gender === "M").length;
              const femaleCount = section.students.filter((s) => s.gender === "F").length;
              const isExpanded = expandedSection === section.section;

              return (
                <div
                  key={section.section}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.section)}
                    className="w-full flex items-center justify-between p-4 md:p-5 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-maroon" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 font-mono">{section.section}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 font-mono">
                            {section.count} students total
                          </span>
                          <span className="text-xs text-blue-600 font-mono">
                            ♂ {maleCount}
                          </span>
                          <span className="text-xs text-pink-600 font-mono">
                            ♀ {femaleCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform flex-shrink-0",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Student List */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50/50 p-4 md:p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Male */}
                        <div>
                          <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <User className="w-3 h-3" /> Male ({maleCount})
                          </h4>
                          <ol className="space-y-1.5">
                            {section.students
                              .filter((s) => s.gender === "M")
                              .map((student, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-gray-700"
                                >
                                  <span className="text-[10px] font-mono text-gray-400 w-5 flex-shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <span>{student.name}</span>
                                </li>
                              ))}
                          </ol>
                        </div>
                        {/* Female */}
                        <div>
                          <h4 className="text-xs font-semibold text-pink-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <User className="w-3 h-3" /> Female ({femaleCount})
                          </h4>
                          <ol className="space-y-1.5">
                            {section.students
                              .filter((s) => s.gender === "F")
                              .map((student, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-gray-700"
                                >
                                  <span className="text-[10px] font-mono text-gray-400 w-5 flex-shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <span>{student.name}</span>
                                </li>
                              ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grand Total */}
          <ScrollAnimation direction="up" className="mt-6">
            <div className="bg-maroon/5 border-2 border-maroon/20 rounded-xl p-4 md:p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {activeYear === "all" ? "Grand Total" : `${yearTabs.find((t) => t.value === activeYear)?.label} Total`}
                </p>
                <p className="text-2xl font-bold text-maroon">
                  {filteredSections.reduce((sum, s) => sum + s.count, 0)} students
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-400">BSIT — AY {academicYear}</p>
                <p className="text-sm font-semibold text-gray-700">
                  {filteredSections.length} section{filteredSections.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
