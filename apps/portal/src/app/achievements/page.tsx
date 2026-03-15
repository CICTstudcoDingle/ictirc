import type { Metadata } from "next";
import PublicPageLayout from "@/components/layout/public-page-layout";
import { Trophy, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CICT Achievements",
  description:
    "Celebrating achievements, milestones, and accomplishments of CICT students and faculty.",
};

// Static placeholder data
const achievements = [
  {
    id: 1,
    title: "Regional IT Quiz Competition Champions",
    category: "award",
    categoryLabel: "🏆 Award",
    description:
      "CICT students dominated the regional IT quiz bee, securing 1st and 3rd place against 12 competing colleges.",
    date: "March 2025",
    isFeatured: true,
  },
  {
    id: 2,
    title: "CICT Tech Portal Launch",
    category: "milestone",
    categoryLabel: "🚀 Milestone",
    description:
      "Officially launched the digital student portal, connecting over 500 students with real-time announcements and services.",
    date: "January 2025",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Community Extension Program",
    category: "outreach",
    categoryLabel: "🤝 Outreach",
    description:
      "Conducted free computer literacy workshops for Dingle community members, reaching 120+ participants.",
    date: "November 2024",
    isFeatured: false,
  },
  {
    id: 4,
    title: "IO Week 2024: Hybrid Innovation Sprint",
    category: "event",
    categoryLabel: "📅 Event",
    description:
      "Successfully organized the first hybrid IT week with coding contests, hackathons, and expert talks.",
    date: "October 2024",
    isFeatured: false,
  },
  {
    id: 5,
    title: "Research Paper Published in IRJICT",
    category: "award",
    categoryLabel: "🏆 Award",
    description:
      "Student research on AI-assisted learning was accepted and published in the IRJICT research journal.",
    date: "September 2024",
    isFeatured: false,
  },
  {
    id: 6,
    title: "Web Development Bootcamp",
    category: "event",
    categoryLabel: "📅 Event",
    description:
      "3-day intensive bootcamp covering React, Next.js, and modern web technologies attended by 80+ students.",
    date: "August 2024",
    isFeatured: false,
  },
];

const featured = achievements.filter((a) => a.isFeatured);

export default function AchievementsPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            CICT Achievements
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Celebrating our accomplishments, milestones, and community impact
          </p>
        </div>

        {/* Featured Carousel */}
        {featured.length > 0 && (
          <div className="relative mb-12 overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-maroon-900/30 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-500/20 text-5xl flex-shrink-0">
                <Trophy className="w-12 h-12 text-gold-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
                  ⭐ Featured
                </div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  {featured[0].title}
                </h2>
                <p className="mt-3 text-white/70">{featured[0].description}</p>
                <p className="mt-2 text-sm text-white/50">{featured[0].date}</p>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gold-400 font-medium">
                  {item.categoryLabel}
                </span>
                {item.isFeatured && (
                  <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-white/60 line-clamp-3">
                {item.description}
              </p>
              <p className="mt-4 text-xs text-white/40">{item.date}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/timeline"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
          >
            View Full Timeline →
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
