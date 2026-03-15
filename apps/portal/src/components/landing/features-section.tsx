"use client";

import { useRef } from "react";
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
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 px-4 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge-gold mb-4 inline-block">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-4">
            Everything You Need
          </h2>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            Your one-stop hub for student council operations, events, and
            academic services.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.title}
                href={feature.href}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 text-gold-400 text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore →
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
