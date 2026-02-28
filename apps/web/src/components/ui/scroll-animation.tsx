"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@ictirc/ui";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  priority?: boolean;
  staggerIndex?: number;
  delay?: number;
}

/**
 * Lightweight scroll-triggered animation using IntersectionObserver
 * instead of GSAP + ScrollTrigger. This eliminates ~60KB of JS from
 * the critical path and improves INP by removing GSAP's RAF overhead.
 *
 * CSS transitions handle the actual animation, which runs on the
 * compositor thread and do not block the main thread.
 */
export function ScrollAnimation({
  children,
  className,
  direction = "up",
  staggerIndex = 0,
  delay = 0,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Calculate initial transform based on direction
  const transforms: Record<string, string> = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
  };

  const totalDelay = delay + staggerIndex * 0.1;

  return (
    <div
      ref={elementRef}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : transforms[direction],
        transition: `opacity 0.6s ease-out ${totalDelay}s, transform 0.6s ease-out ${totalDelay}s`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
