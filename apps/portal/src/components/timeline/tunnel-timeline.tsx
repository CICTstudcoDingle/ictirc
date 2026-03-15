"use client";

import React, {
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowLeft, Home, ArrowRight } from "lucide-react";

// ── Types ──
interface TimelineHighlight {
  id: number;
  year: number;
  term_label: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  is_featured: boolean;
  president?: string;
}

interface TimelineEvent {
  id?: number;
  year: string;
  title: string;
  description: string;
  type?: string;
  color: "gold" | "maroon" | "white";
  president?: string;
}

interface TunnelTimelineProps {
  highlights?: TimelineHighlight[];
}

// ── Constants ──
const CARD_SPACING = 1000;
const FADE_IN_START = -1500;
const FADE_IN_END = -500;
const FADE_OUT_START = 100;
const FADE_OUT_END = 600;
const RUNWAY_BUFFER = 3000;

// ── Helpers ──
const calculateOpacity = (z: number): number => {
  if (z < FADE_IN_START) return 0;
  if (z < FADE_IN_END)
    return (z - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
  if (z < FADE_OUT_START) return 1;
  if (z < FADE_OUT_END)
    return 1 - (z - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
  return 0;
};

const calculateScale = (z: number): number => {
  if (z < FADE_IN_START) return 0.5;
  if (z > 0) return 1;
  return 0.5 + 0.5 * ((z - FADE_IN_START) / (0 - FADE_IN_START));
};

// Fallback events
const fallbackEvents: TimelineEvent[] = [
  {
    year: "2024",
    title: "Portal Launch",
    description: "The CICT Tech Portal officially launches.",
    color: "gold",
  },
  {
    year: "2023",
    title: "Council Digitalization",
    description: "Student Council begins digital transformation.",
    color: "maroon",
  },
  {
    year: "2022",
    title: "IT Week Innovation",
    description: "First hybrid IT Week event.",
    color: "gold",
  },
];

// ── TimelineCard ──
function TimelineCard({
  event,
  index,
  worldZ,
}: {
  event: TimelineEvent;
  index: number;
  worldZ: number;
}) {
  const baseZ = -1000 - index * CARD_SPACING;
  const actualZ = baseZ + worldZ;

  const opacity = calculateOpacity(actualZ);
  const scale = calculateScale(actualZ);
  const shouldDisplay =
    actualZ <= FADE_OUT_END && actualZ >= FADE_IN_START - 500;

  const colors: Record<
    string,
    { accent: string; glow: string; border: string; text: string; bg: string }
  > = {
    gold: {
      accent: "from-gold-400 to-gold-600",
      glow: "shadow-gold-500/60",
      border: "border-gold-500/50",
      text: "text-maroon-900",
      bg: "bg-maroon-950",
    },
    maroon: {
      accent: "from-maroon-400 to-maroon-600",
      glow: "shadow-maroon-400/60",
      border: "border-maroon-400/50",
      text: "text-white",
      bg: "bg-maroon-950",
    },
    white: {
      accent: "from-white to-gray-200",
      glow: "shadow-white/40",
      border: "border-white/50",
      text: "text-maroon-900",
      bg: "bg-maroon-950",
    },
  };

  const c = colors[event.color] || colors.gold;

  if (!shouldDisplay) return null;

  return (
    <div
      className="absolute left-1/2 top-1/2 w-96 pointer-events-auto"
      style={{
        transform: `translate(-50%, -50%) translateZ(${baseZ}px) scale(${scale})`,
        opacity,
        zIndex: 1000 - index,
        willChange: "transform, opacity",
      }}
    >
      <div
        className={`relative p-8 rounded-2xl ${c.bg} border-2 ${c.border} shadow-2xl ${c.glow} transform-gpu`}
      >
        {/* Glow line */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${c.accent}`}
        />

        {/* Year badge */}
        <div
          className={`inline-block px-5 py-2 mb-2 rounded-full text-sm font-bold bg-gradient-to-r ${c.accent} ${c.text} shadow-lg`}
        >
          {event.year}
        </div>

        {/* President */}
        {event.president && (
          <p className="text-gold-400/80 text-xs font-medium mb-3 tracking-wide">
            👤 President: {event.president}
          </p>
        )}

        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          {event.title}
        </h3>

        <p className="text-base text-white/80 leading-relaxed mb-6">
          {event.description}
        </p>

        <Link
          href={`/timeline#year-${event.year}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md shadow-lg mt-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ── Grid Runners (neon light trails) ──
interface GridRunnersProps {
  instanceId: string;
  count: number;
  length: number;
  cross: number;
  direction: "vertical" | "horizontal";
}

const GridRunners = React.memo(function GridRunners({
  instanceId,
  count,
  length,
  cross,
  direction,
}: GridRunnersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const runners = useMemo(() => {
    const seed = instanceId
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: count }).map((_, i) => {
      const pr = ((seed + i * 7919) % 1000) / 1000;
      const cr = ((seed + i * 6971) % 1000) / 1000;
      return {
        id: `${instanceId}-${i}`,
        crossPos: Math.floor(pr * (cross / 100)) * 100,
        color:
          cr > 0.66 ? "gold" : cr > 0.33 ? "maroon" : ("white" as string),
        speed: pr * 10 + 10,
        delay: pr * 10,
        trailLength: pr * 300 + 200,
      };
    });
  }, [instanceId, count, cross]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      runners.forEach((runner) => {
        const sel = `[data-runner="${runner.id}"]`;
        if (direction === "vertical") {
          gsap.to(sel, {
            y: length,
            duration: runner.speed,
            ease: "none",
            repeat: -1,
            delay: runner.delay,
            startAt: { y: -500 },
          });
        } else {
          gsap.to(sel, {
            x: length,
            duration: runner.speed,
            ease: "none",
            repeat: -1,
            delay: runner.delay,
            startAt: { x: -500 },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [runners, length, direction]);

  const getColors = (color: string) => {
    switch (color) {
      case "gold":
        return "from-yellow-300 via-yellow-500/50 to-transparent shadow-[0_0_15px_rgba(253,224,71,0.6)]";
      case "maroon":
        return "from-red-500 via-maroon-500/50 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.6)]";
      case "white":
        return "from-white via-blue-100/50 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]";
      default:
        return "from-gold-400 to-transparent";
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      {runners.map((runner) => (
        <div
          key={runner.id}
          data-runner={runner.id}
          className={`absolute rounded-full bg-gradient-to-b ${getColors(runner.color)} mix-blend-screen`}
          style={{
            opacity: 0.9,
            willChange: "transform",
            ...(direction === "vertical"
              ? {
                  width: "4px",
                  height: runner.trailLength,
                  left: runner.crossPos - 1,
                  top: -500,
                }
              : {
                  height: "4px",
                  width: runner.trailLength,
                  top: runner.crossPos - 1,
                  left: -500,
                }),
          }}
        />
      ))}
    </div>
  );
});

// ── Main TunnelTimeline ──
export default function TunnelTimeline({ highlights }: TunnelTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldZ, setWorldZ] = useState(0);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!highlights || highlights.length === 0) return fallbackEvents;
    return highlights.map((h) => ({
      id: h.id,
      year: String(h.year),
      title: h.title,
      description: h.description,
      type: h.type,
      color: (
        h.color === "gold" || h.color === "maroon" || h.color === "white"
          ? h.color
          : h.is_featured
            ? "gold"
            : "maroon"
      ) as "gold" | "maroon" | "white",
      president: h.president,
    }));
  }, [highlights]);

  const years = useMemo(() => {
    const seen = new Set<string>();
    return timelineEvents
      .filter((e) => {
        if (seen.has(e.year)) return false;
        seen.add(e.year);
        return true;
      })
      .map((e) => e.year);
  }, [timelineEvents]);

  const totalDepth = useMemo(
    () => timelineEvents.length * CARD_SPACING + RUNWAY_BUFFER,
    [timelineEvents.length]
  );
  const vhPerCard = 150;
  const scrollHeight = `${100 + timelineEvents.length * vhPerCard}vh`;
  const gridLength = useMemo(
    () => Math.max(15000, totalDepth + 5000),
    [totalDepth]
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        setWorldZ(self.progress * totalDepth);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [totalDepth]);

  const currentYearIndex = useMemo(() => {
    const cardIndex = Math.floor((worldZ - 500) / CARD_SPACING);
    return Math.max(0, Math.min(cardIndex, timelineEvents.length - 1));
  }, [worldZ, timelineEvents.length]);

  const gridPattern = `
    linear-gradient(rgba(220,20,60,0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,20,60,0.4) 1px, transparent 1px),
    linear-gradient(rgba(180,0,0,0.2) 3px, transparent 3px),
    linear-gradient(90deg, rgba(180,0,0,0.2) 3px, transparent 3px)
  `;

  const tunnelHalf = 500;

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: scrollHeight, position: "relative" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Nav Header */}
        <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon-900/80 border border-gold-500/30 text-white hover:bg-maroon-800 transition-all backdrop-blur-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 overflow-hidden">
                  <img
                    src="/assets/CICT_Logo.svg"
                    alt="CICT Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-white/90 group-hover:text-gold-400 transition-colors">
                  CICT Tech Portal
                </span>
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/25"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </header>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[50]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* 3D Perspective Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(${worldZ}px)`,
            }}
          >
            {/* Floor */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: "4000px",
                height: `${gridLength}px`,
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) translateY(${tunnelHalf}px) rotateX(90deg)`,
                backgroundSize: "100px 100px",
                backgroundImage: gridPattern,
                backfaceVisibility: "hidden",
              }}
            >
              <GridRunners
                instanceId="floor-v"
                count={15}
                length={gridLength}
                cross={4000}
                direction="vertical"
              />
              <GridRunners
                instanceId="floor-h"
                count={8}
                length={4000}
                cross={gridLength}
                direction="horizontal"
              />
            </div>

            {/* Ceiling */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: "4000px",
                height: `${gridLength}px`,
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) translateY(-${tunnelHalf}px) rotateX(90deg) rotateY(180deg)`,
                backgroundSize: "100px 100px",
                backgroundImage: gridPattern,
                backfaceVisibility: "hidden",
              }}
            >
              <GridRunners
                instanceId="ceiling-v"
                count={15}
                length={gridLength}
                cross={4000}
                direction="vertical"
              />
              <GridRunners
                instanceId="ceiling-h"
                count={8}
                length={4000}
                cross={gridLength}
                direction="horizontal"
              />
            </div>

            {/* Left Wall */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: `${gridLength}px`,
                height: "1000px",
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) translateX(-${tunnelHalf}px) rotateY(90deg)`,
                backgroundSize: "100px 100px",
                backgroundImage: gridPattern,
                backfaceVisibility: "hidden",
              }}
            >
              <GridRunners
                instanceId="left-wall"
                count={20}
                length={gridLength}
                cross={1000}
                direction="horizontal"
              />
            </div>

            {/* Right Wall */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: `${gridLength}px`,
                height: "1000px",
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) translateX(${tunnelHalf}px) rotateY(-90deg)`,
                backgroundSize: "100px 100px",
                backgroundImage: gridPattern,
                backfaceVisibility: "hidden",
              }}
            >
              <GridRunners
                instanceId="right-wall"
                count={20}
                length={gridLength}
                cross={1000}
                direction="horizontal"
              />
            </div>

            {/* Timeline Cards */}
            {timelineEvents.map((event, index) => (
              <TimelineCard
                key={`${event.year}-${index}`}
                event={event}
                index={index}
                worldZ={worldZ}
              />
            ))}

            {/* Horizon Light */}
            <div
              className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: "translateZ(-9000px)",
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 tracking-tight drop-shadow-lg">
            CICT TIMELINE
          </h1>
          <p className="text-sm text-gold-400/80 mt-2 tracking-[0.5em] uppercase font-bold">
            Scroll to Navigate
          </p>
        </div>

        {/* Year Indicator */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
          {years.map((year, index) => (
            <div
              key={year}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index === currentYearIndex ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentYearIndex
                    ? "bg-gold-400 shadow-lg shadow-gold-400/50 scale-125"
                    : "bg-white/30"
                }`}
              />
              <span
                className={`text-sm font-bold transition-all duration-300 ${
                  index === currentYearIndex ? "text-gold-400" : "text-white/50"
                }`}
              >
                {year}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[60]">
          <div className="w-1 h-40 bg-white/10 rounded-full overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-gold-400 to-maroon-500 rounded-full transition-all duration-100"
              style={{ height: `${(worldZ / totalDepth) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* End CTA */}
      <div className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center z-[70]">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/assets/CICT_Logo.svg"
              alt="CICT Logo"
              className="w-24 h-24 object-contain opacity-80 drop-shadow-lg"
            />
          </div>
          <p className="text-white/60 text-lg mb-4">End of Timeline</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 text-maroon-900 font-bold text-lg hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/30"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
