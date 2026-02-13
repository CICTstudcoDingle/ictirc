"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Film, Video } from "lucide-react";
import { ScrollAnimation } from "../ui/scroll-animation";

interface HeroVideo {
  id: string;
  title: string;
  type: "PROMOTIONAL" | "TEASER";
  streamUrl: string | null;
  editorName: string;
  uploadDate: string;
}

interface HeroVideoCardClientProps {
  videos: HeroVideo[];
}

export function HeroVideoCardClient({ videos }: HeroVideoCardClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Rotate between videos every 12 seconds
  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [videos.length]);

  const current = videos[currentIndex];
  if (!current) return null;

  return (
    <>
      {/* Desktop Card - Below event card area */}
      <div className="hidden lg:block lg:absolute lg:bottom-6 lg:right-8 xl:right-16 w-80 z-20">
        <ScrollAnimation direction="right" delay={1.4}>
          <Link href="/promotional-videos">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group shadow-2xl">
              {/* Mini Video Preview */}
              <div className="relative h-36 bg-gray-900">
                {current.streamUrl && (
                  <video
                    ref={videoRef}
                    key={current.id}
                    src={current.streamUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      current.type === "PROMOTIONAL"
                        ? "bg-maroon/80 text-white"
                        : "bg-amber-500/80 text-white"
                    }`}
                  >
                    {current.type === "PROMOTIONAL" ? (
                      <>
                        <Film className="w-3 h-3" />
                        CICT
                      </>
                    ) : (
                      <>
                        <Video className="w-3 h-3" />
                        IT Week
                      </>
                    )}
                  </span>
                </div>

                {/* Title overlay at bottom */}
                <div className="absolute bottom-2 left-3 right-3">
                  <h4 className="text-white font-semibold text-sm truncate group-hover:text-gold transition-colors">
                    {current.title}
                  </h4>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Film className="w-3.5 h-3.5 text-gold" />
                  <span>Promotional Videos</span>
                </div>
                <div className="flex items-center text-gold font-medium text-xs group-hover:gap-1.5 transition-all">
                  Watch
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Dot indicators */}
              {videos.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-2">
                  {videos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === currentIndex ? "bg-gold" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>
        </ScrollAnimation>
      </div>

      {/* Mobile Banner - Below event banner */}
      <div className="lg:hidden mt-3">
        <ScrollAnimation direction="up" delay={1.2}>
          <Link href="/promotional-videos">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden group shadow-xl flex items-stretch">
              {/* Mini thumbnail */}
              <div className="relative w-28 flex-shrink-0 bg-gray-900">
                {current.streamUrl && (
                  <video
                    key={`mobile-${current.id}`}
                    src={current.streamUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 p-3 flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        current.type === "PROMOTIONAL"
                          ? "bg-maroon/80 text-white"
                          : "bg-amber-500/80 text-white"
                      }`}
                    >
                      {current.type === "PROMOTIONAL" ? "CICT" : "IT Week"}
                    </span>
                    <span className="text-[10px] text-gray-400">Video</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm truncate group-hover:text-gold transition-colors">
                    {current.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </ScrollAnimation>
      </div>
    </>
  );
}
