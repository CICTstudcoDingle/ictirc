"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import PublicPageLayout from "@/components/layout/public-page-layout";
import {
  Sparkles,
  Trophy,
  Calendar,
  Star,
  GraduationCap,
  Rocket,
  Users,
} from "lucide-react";

interface Highlight {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: string;
}

interface AcademicYear {
  id: number;
  year_start: number;
  year_end: number;
  label: string;
  theme: string | null;
  is_current: boolean;
  highlights: Highlight[];
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "award":
      return <Trophy className="w-5 h-5" />;
    case "event":
      return <Calendar className="w-5 h-5" />;
    case "project":
      return <Sparkles className="w-5 h-5" />;
    case "milestone":
      return <Rocket className="w-5 h-5" />;
    default:
      return <Star className="w-5 h-5" />;
  }
};

// Static fallback data
const fallbackYears: AcademicYear[] = [
  {
    id: 1,
    year_start: 2024,
    year_end: 2025,
    label: "SY 2024-2025",
    theme: "Digital Transformation Era",
    is_current: true,
    highlights: [
      {
        id: 1,
        title: "Official Tech Portal Launch",
        description:
          "Launched the CICT Tech Portal to streamline student services and communication.",
        type: "milestone",
        icon: "🚀",
      },
      {
        id: 2,
        title: "Hybrid IO Week",
        description:
          "Innovation and outreach week combining online and physical activites.",
        type: "event",
        icon: "💡",
      },
      {
        id: 3,
        title: "Expanded Org Partnerships",
        description: "Cross-college collaborations with other departments.",
        type: "award",
        icon: "🤝",
      },
    ],
  },
  {
    id: 2,
    year_start: 2023,
    year_end: 2024,
    label: "SY 2023-2024",
    theme: "Restructuring & Growth",
    is_current: false,
    highlights: [
      {
        id: 4,
        title: "Constitution Amendments",
        description: "Modernized governance framework for the student council.",
        type: "project",
        icon: "📜",
      },
      {
        id: 5,
        title: "First Full F2F General Assembly",
        description: "Post-pandemic milestone gathering of the student body.",
        type: "event",
        icon: "🎤",
      },
      {
        id: 6,
        title: "Skill Development Workshops",
        description:
          "Technical training series for web development and design.",
        type: "event",
        icon: "🛠️",
      },
    ],
  },
  {
    id: 3,
    year_start: 2022,
    year_end: 2023,
    label: "SY 2022-2023",
    theme: "Recovery & Reconnection",
    is_current: false,
    highlights: [
      {
        id: 7,
        title: "Return to Campus Activities",
        description: "First physical events after the pandemic period.",
        type: "milestone",
        icon: "🏫",
      },
      {
        id: 8,
        title: "Intramurals Revival",
        description:
          "Brought back the annual sports festival with new categories.",
        type: "event",
        icon: "🏆",
      },
    ],
  },
];

function YearSection({
  year,
  index,
}: {
  year: AcademicYear;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  return (
    <div id={`year-${year.year_start}`} className="relative group scroll-mt-32">
      <div
        ref={cardRef}
        className="relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 md:p-10 overflow-hidden hover:border-gold-500/30 transition-all duration-500"
      >
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-800/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div
          className={`grid md:grid-cols-2 gap-10 items-start ${!isEven ? "md:grid-flow-dense" : ""}`}
        >
          {/* Text Content */}
          <div className={!isEven ? "md:col-start-2" : ""}>
            {/* Year Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 font-bold text-sm">
                {year.label}
              </div>
              {year.is_current && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                  Current
                </span>
              )}
            </div>

            {/* Theme Title */}
            <h2 className="text-3xl font-bold text-white mb-6">
              {year.theme || `Academic Year ${year.year_start}`}
            </h2>

            {/* Highlights List */}
            {year.highlights.length > 0 ? (
              <div className="space-y-3">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
                  Key Highlights
                </p>
                {year.highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="flex items-start gap-3 text-white/80 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gold-500/20 text-gold-400">
                      {highlight.icon ? (
                        <span className="text-sm">{highlight.icon}</span>
                      ) : (
                        getTypeIcon(highlight.type)
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-white">
                        {highlight.title}
                      </p>
                      <p className="text-sm text-white/50">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 italic">
                No featured highlights recorded yet.
              </p>
            )}
          </div>

          {/* Photo Gallery Placeholder */}
          <div
            className={`relative ${!isEven ? "md:col-start-1 md:row-start-1" : ""}`}
          >
            <div className="h-64 md:h-80 rounded-xl bg-gradient-to-br from-maroon-900/50 to-black border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-gold-500/20 transition-all">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-maroon-600/20 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white/20" />
                </div>
                <p className="text-white/20 font-mono text-xs">
                  Photo Gallery
                </p>
                <p className="text-gold-500/30 text-[10px] mt-2">
                  [Images of {year.year_start} Events]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelineContent() {
  const years = fallbackYears;

  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            IT Through the Years
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
            Celebrating the legacy, leadership, and milestones that defined the
            College of Information and Communications Technology.
          </p>
        </div>

        {/* Year Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {years.map((year) => (
            <a
              key={year.id}
              href={`#year-${year.year_start}`}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                year.is_current
                  ? "bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/30"
                  : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
              }`}
            >
              {year.year_start}
            </a>
          ))}
        </div>

        {/* Timeline Sections */}
        <div className="space-y-16">
          {years.map((year, index) => (
            <YearSection key={year.id} year={year} index={index} />
          ))}
        </div>

        {/* Explore More */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Explore More</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/achievements"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
            >
              <Trophy className="w-5 h-5" />
              View Achievements
            </Link>
            <Link
              href="/org-chart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm"
            >
              <Users className="w-5 h-5" />
              View Org Chart
            </Link>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
