"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Users, GraduationCap, UsersRound } from "lucide-react";

const sampleOfficers = [
  { name: "Student Council President", role: "President", image: null },
  { name: "Vice President - Internal", role: "VP Internal", image: null },
  { name: "Vice President - External", role: "VP External", image: null },
  { name: "Secretary", role: "Secretary", image: null },
];

export default function OrgChartPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-black via-maroon-950/30 to-black overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-maroon-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
            <Users className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Leadership
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            CICT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-white">
              Student Council
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Meet the leaders shaping the future of CICT
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleOfficers.map((officer, index) => (
            <div
              key={officer.role}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:bg-white/[0.07] hover:border-gold-500/20 transition-all duration-500 hover:-translate-y-1 text-center"
            >
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-maroon-800 to-maroon-900 border-2 border-white/10 flex items-center justify-center group-hover:border-gold-500/40 transition-colors">
                <GraduationCap className="w-8 h-8 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-gold-500/20 text-gold-400">
                {officer.role}
              </span>
              <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                {officer.name}
              </h3>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gold-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/org-chart"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
          >
            <UsersRound className="w-5 h-5" />
            View Full Org Chart
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
