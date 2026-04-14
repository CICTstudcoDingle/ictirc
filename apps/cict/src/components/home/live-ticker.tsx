"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TickerItem = {
  id: string;
  text: string;
  type: "enrollment" | "announcement";
};

export function LiveTicker({ initial }: { initial: TickerItem[] }) {
  const [items, setItems] = useState<TickerItem[]>(initial);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("live-ticker")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enrollments" },
        (payload) => {
          const row = payload.new as {
            id: number;
            course?: string;
            year_level?: string;
          };
          setItems((prev) => [
            {
              id: `enr-${row.id}-${Date.now()}`,
              text: `🎓 New enrollment in ${row.course ?? "BSIT"} — Year ${row.year_level ?? ""}`.trim(),
              type: "enrollment",
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "portal_announcements",
        },
        (payload) => {
          const row = payload.new as { id: string; title: string; status: string };
          if (row.status !== "PUBLISHED") return;
          setItems((prev) => [
            {
              id: `ann-${row.id}`,
              text: `📢 New Announcement: ${row.title}`,
              type: "announcement",
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "portal_announcements",
        },
        (payload) => {
          const row = payload.new as { id: string; title: string; status: string };
          if (row.status !== "PUBLISHED") return;
          setItems((prev) => [
            {
              id: `ann-upd-${row.id}-${Date.now()}`,
              text: `📢 Updated: ${row.title}`,
              type: "announcement",
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items]; // triple for seamless loop

  return (
    <div className="w-full bg-maroon overflow-hidden h-8 flex items-center" aria-live="polite">
      <div className="shrink-0 px-3 bg-maroon-dark border-r border-white/20 h-full flex items-center">
        <span className="text-[10px] font-bold text-gold uppercase tracking-widest whitespace-nowrap">
          Live
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-10 hover:[animation-play-state:paused]">
          {repeated.map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              className="text-xs text-white/90 shrink-0 flex items-center gap-2"
            >
              {item.text}
              <span className="text-white/30 text-xs">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
