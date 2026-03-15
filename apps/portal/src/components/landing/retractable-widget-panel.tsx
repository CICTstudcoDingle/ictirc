"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import MiniCalendarWidget from "./mini-calendar-widget";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  ShoppingBag,
} from "lucide-react";

interface RetractableWidgetPanelProps {
  upcomingEvents?: any[];
}

/**
 * RetractableWidgetPanel - Slide-in/out widget container
 * Fixed to bottom-left, contains Calendar, Achievements, and CICT Shop cards.
 */
export default function RetractableWidgetPanel({
  upcomingEvents = [],
}: RetractableWidgetPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !contentRef.current) return;

    if (isOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(panelRef.current, {
        x: -320,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 p-3 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl text-white shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-gold-400/50 hover:scale-110 ${
          isOpen ? "bottom-6 left-[20.5rem]" : "bottom-6 left-6"
        } hidden md:flex`}
        title={isOpen ? "Hide Widgets" : "Show Widgets"}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gold-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gold-400" />
        )}
      </button>

      {/* Widget Panel */}
      <div
        ref={panelRef}
        className="fixed bottom-6 left-6 z-40 w-[19rem] hidden md:block"
        style={{ transform: "translateX(0)" }}
      >
        <div
          ref={contentRef}
          className="flex flex-col gap-3 max-h-[calc(100vh-7rem)] overflow-y-auto pl-3 pr-2 py-2"
          style={{ direction: "rtl" }}
        >
          {/* Mini Calendar Widget */}
          <div style={{ direction: "ltr" }}>
            <MiniCalendarWidget events={upcomingEvents} />
          </div>

          {/* Achievements Widget */}
          <div style={{ direction: "ltr" }}>
            <Link href="/achievements" className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-5 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-gold-400/40 hover:shadow-gold-500/30 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-maroon-700/20 via-transparent to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-maroon-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/30">
                      <Trophy className="w-4 h-4 text-gold-400" />
                      <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                        Achievements
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors duration-300">
                    CICT Achievements
                  </h3>
                  <p className="text-sm text-white/60 mb-3 leading-relaxed">
                    Do you want to view our accomplishments?
                  </p>
                  <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>View Achievements</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                  </div>
                </div>
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>
            </Link>
          </div>

          {/* CICT Shop Card */}
          <div style={{ direction: "ltr" }}>
            <a
              href="https://cict-dingle.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-5 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-gold-400/40 hover:shadow-gold-500/30 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-maroon-700/20 via-transparent to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-maroon-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/30">
                      <ShoppingBag className="w-4 h-4 text-gold-400" />
                      <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                        Shop
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/40 group-hover:text-gold-400 transition-colors duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors duration-300">
                    CICT Shop
                  </h3>
                  <p className="text-sm text-white/60 mb-3 leading-relaxed">
                    Order customized merchandise—apparels, cups, mugs &amp; more.
                  </p>
                  <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Order Now</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                  </div>
                </div>
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
