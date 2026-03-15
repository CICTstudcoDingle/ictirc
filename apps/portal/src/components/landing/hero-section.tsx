"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import dynamic from "next/dynamic";
import BrokenGlassText from "./broken-glass-text";

// Dynamic import for heavy canvas/physics components (skip SSR)
const HoneycombBackground = dynamic(
  () => import("./honeycomb-background"),
  { ssr: false }
);

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineLeftRef = useRef<HTMLDivElement>(null);
  const headlineRightRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const [showContent, setShowContent] = useState(true);

  const glassTriggerConfig = useMemo(
    () => ({
      triggerRef: sectionRef,
      start: "top top",
      end: "+=300%",
      scrub: 0.5,
    }),
    []
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Initial states
      gsap.set(
        [
          headlineLeftRef.current,
          headlineRightRef.current,
          subtitleRef.current,
          ctaRef.current,
          badgeRef.current,
        ],
        { opacity: 0 }
      );
      gsap.set(headlineLeftRef.current, { x: -100 });
      gsap.set(headlineRightRef.current, { x: 100 });
      gsap.set(
        [subtitleRef.current, ctaRef.current, badgeRef.current],
        { y: 20 }
      );
      gsap.set(logoContainerRef.current, { scale: 1.5 });

      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);

      // MASTER TIMELINE (Pinned)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.5,
          onLeave: () => setShowContent(false),
          onEnterBack: () => setShowContent(true),
        },
      });

      // 0-20%: shrink logo, hide scroll hint, show Badge
      masterTl.to(
        logoContainerRef.current,
        { scale: 0.4, y: "-30vh", opacity: 0.5, duration: 2 },
        0
      );
      masterTl.to(
        scrollHintRef.current,
        { opacity: 0, y: 50, duration: 1 },
        0
      );
      masterTl.to(
        tickerRef.current,
        { opacity: 0, y: -30, duration: 1.5 },
        0
      );
      masterTl.to(
        badgeRef.current,
        { opacity: 1, y: 0, duration: 2 },
        0.5
      );

      // 10-30%: Fly in Headlines
      masterTl.to(
        headlineLeftRef.current,
        { opacity: 1, x: 0, duration: 2, ease: "power2.out" },
        1
      );
      masterTl.to(
        headlineRightRef.current,
        { opacity: 1, x: 0, duration: 2, ease: "power2.out" },
        1.2
      );

      // 50-70%: Show Subtitle & CTA
      masterTl.to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 2 },
        5.5
      );
      masterTl.to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 2 },
        6
      );

      // 90-100%: Fade out ALL
      masterTl.to(
        contentRef.current,
        { opacity: 0, duration: 1 },
        9
      );
      masterTl.to(
        logoContainerRef.current,
        { opacity: 0, duration: 1 },
        9
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden z-0"
    >
      {/* Background Layers */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgb(15, 5, 5) 0%, rgb(30, 10, 10) 50%, rgb(10, 5, 5) 100%)",
        }}
      />
      <div className="absolute inset-0 z-10">
        <HoneycombBackground />
      </div>
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Ticker Tape Watermark */}
      <div
        ref={tickerRef}
        className="absolute top-32 left-0 right-0 z-50 overflow-hidden pointer-events-none"
      >
        <div className="flex animate-ticker whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-8 text-gold-400/20 text-4xl font-bold tracking-[0.3em] uppercase flex-shrink-0"
            >
              <span>
                College of Information and Communications Technology
              </span>
              <span className="text-white/15">•</span>
              <span>Dingle Campus</span>
              <span className="text-white/15">•</span>
              <span>
                Iloilo State University of Fisheries Science and
                Technology
              </span>
              <span className="text-white/15">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div
        ref={logoContainerRef}
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
      >
        <div className="h-80 w-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem] rounded-full bg-gradient-to-br from-maroon-900/50 to-black/50 flex items-center justify-center border border-gold/20 shadow-2xl">
          <span className="text-6xl md:text-7xl font-display font-bold text-gradient-gold tracking-tight">
            CICT
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={`fixed inset-x-0 z-40 flex flex-col items-center justify-end pb-20 pointer-events-none transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "25%", bottom: "0" }}
      >
        <div
          className="text-center w-full max-w-7xl mx-auto px-4"
          style={{ transformOrigin: "center center" }}
        >
          {/* Badge */}
          <div ref={badgeRef} className="mb-6 flex justify-center">
            <div className="badge-gold text-sm tracking-[0.2em] uppercase backdrop-blur-md shadow-gold-glow">
              Welcome to the Future
            </div>
          </div>

          {/* "YOUR GATEWAY TO" */}
          <div
            ref={headlineLeftRef}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase mb-2 font-display"
          >
            YOUR GATEWAY TO
          </div>

          {/* "STUDENT EXCELLENCE" */}
          <div
            ref={headlineRightRef}
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gradient-gold uppercase mb-4 font-display"
          >
            STUDENT EXCELLENCE
          </div>

          {/* BROKEN GLASS BRANDING */}
          <div className="relative h-32 md:h-48 lg:h-56 w-full flex items-center justify-center my-4 overflow-visible z-50">
            <BrokenGlassText
              scrollTrigger={glassTriggerConfig}
              delayRatio={0.2}
              durationRatio={0.3}
            >
              <div className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter uppercase leading-none font-display">
                CICT TECH PORTAL
              </div>
            </BrokenGlassText>
          </div>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-4 max-w-xl text-center text-base text-white/60 px-4"
        >
          The official portal of the CICT Student Council.
          <br />
          Stay connected with announcements, events, and your community.
        </p>

        {/* Buttons */}
        <div ref={ctaRef} className="mt-10 flex gap-4 pointer-events-auto">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
          ) : (
            <>
              <Link href="/login" className="btn-primary">
                Enter Portal
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
              <Link href="#features" className="btn-secondary">
                Explore
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
