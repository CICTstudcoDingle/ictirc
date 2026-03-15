"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  Megaphone,
  Calendar,
  Users,
  BookOpen,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Megaphone,
    title: "Announcements",
    description:
      "Stay updated with the latest news, policies, and directives from the CICT Student Council.",
    href: "/announcements",
  },
  {
    icon: Calendar,
    title: "Events & Calendar",
    description:
      "Browse upcoming events, register for activities, and never miss a deadline.",
    href: "/events",
  },
  {
    icon: Users,
    title: "Org Chart",
    description:
      "View the Student Council organizational structure and officer profiles.",
    href: "/org-chart",
  },
  {
    icon: BookOpen,
    title: "IT Through The Years",
    description:
      "Explore the rich history and milestones of CICT across academic years.",
    href: "/timeline",
  },
  {
    icon: Shield,
    title: "Student Portal",
    description:
      "Access your enrollment status, payment records, and event registrations.",
    href: "/dashboard",
  },
  {
    icon: BarChart3,
    title: "Research Journal",
    description:
      "Visit IRJICT — the official research journal of CICT for published papers.",
    href: process.env.NEXT_PUBLIC_IRJICT_URL || "#",
    external: true,
  },
];

/**
 * FeaturesSection - Parallax split layout (ported from Laravel)
 *
 * Left: CSS sticky section label that stays visible while scrolling
 * Right: Glassmorphic container with individually scrub-animated features
 *
 * INP optimized: uses CSS `position: sticky` instead of GSAP `pin`
 * to avoid layout thrash and reduce main-thread blocking.
 */
export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Animate each feature row as it enters the viewport
      contentRefs.current.forEach((content) => {
        if (!content) return;

        gsap.fromTo(
          content,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: content,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.5,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-maroon-900/40 to-black"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        {/* Split Layout: Left sticky label + Right scrolling content */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Side - CSS Sticky Label (INP-friendly) */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start">
            <div className="mb-4">
              <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
                Features
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white lg:text-5xl">
              Everything you need,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                in one place
              </span>
            </h2>
            <p className="mt-6 text-lg text-white/50 leading-relaxed">
              A comprehensive portal designed to streamline communication and
              engagement between students and the CICT Student Council.
            </p>
          </div>

          {/* Right Side - Glassmorphic Container with Scrolling Features */}
          <div className="lg:w-2/3">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 lg:p-12">
              {/* Features list - each animates on scroll */}
              <div className="space-y-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isExternal = "external" in feature && feature.external;
                  const Wrapper = isExternal ? "a" : Link;
                  const wrapperProps = isExternal
                    ? {
                        href: feature.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : { href: feature.href };

                  return (
                    <div
                      key={feature.title}
                      ref={(el) => {
                        contentRefs.current[index] = el;
                      }}
                      className="group flex gap-6 items-start"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 ring-1 ring-white/10 group-hover:ring-gold-500/30 transition-all">
                        <Icon className="h-7 w-7 text-gold-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-white/50 leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Learn more link */}
                        <Wrapper
                          {...(wrapperProps as any)}
                          className="inline-flex items-center mt-4 text-sm text-gold-400/70 hover:text-gold-400 transition-colors"
                        >
                          <span>Learn more</span>
                          <svg
                            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Wrapper>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
