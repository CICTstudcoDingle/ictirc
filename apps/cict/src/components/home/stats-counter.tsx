"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@ictirc/ui";

interface StatsCounterProps {
  stats: {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
  }[];
  className?: string;
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * value));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(value);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-bold text-maroon tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatsCounter({ stats, className }: StatsCounterProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", className)}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card group"
        >
          <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
          <p className="text-sm md:text-base text-gray-500 font-medium mt-2 group-hover:text-maroon transition-colors">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
