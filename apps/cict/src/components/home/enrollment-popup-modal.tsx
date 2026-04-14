"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, X } from "lucide-react";

type EnrollmentEvent = {
  id: string;
  course?: string;
  year_level?: string;
  section?: string;
  user_id?: string;
};

type PopupItem = EnrollmentEvent & {
  queueId: string;
  timestamp: Date;
};

const AUTO_DISMISS_MS = 6000;

export function EnrollmentPopupModal() {
  const [queue, setQueue] = useState<PopupItem[]>([]);
  const [current, setCurrent] = useState<PopupItem | null>(null);
  const [progress, setProgress] = useState(100);
  const supabase = createClient();

  // Process queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
      setProgress(100);
    }
  }, [current, queue]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!current) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        setCurrent(null);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [current]);

  const dismiss = useCallback(() => {
    setCurrent(null);
    setProgress(100);
  }, []);

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("enrollment-popup")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enrollments" },
        (payload) => {
          const row = payload.new as EnrollmentEvent;
          setQueue((q) => [
            ...q,
            {
              ...row,
              queueId: `${row.id}-${Date.now()}`,
              timestamp: new Date(),
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!current) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-50 w-[340px] animate-slide-up"
      role="status"
      aria-live="polite"
      aria-label="New enrollment notification"
    >
      <div className="relative bg-maroon/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
          <div
            className="h-full bg-gold transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4 pt-5">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center shrink-0 border border-gold/30">
              <GraduationCap className="w-5 h-5 text-gold" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                  New Enrollment
                </span>
                <span className="text-[10px] text-white/40">
                  {current.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {current.course ?? "BSIT"}{current.year_level ? ` — Year ${current.year_level}` : ""}
              </p>
              {current.section && (
                <p className="text-xs text-white/60 mt-0.5">
                  Section {current.section}
                </p>
              )}
              <p className="text-xs text-white/50 mt-1">
                A new student has been enrolled.
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="shrink-0 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
