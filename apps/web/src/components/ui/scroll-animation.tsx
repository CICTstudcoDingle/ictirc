"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@ictirc/ui";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  priority?: boolean;
  staggerIndex?: number;
  delay?: number;
}

export function ScrollAnimation({
  children,
  className,
  direction = "up",
  staggerIndex = 0,
  delay = 0,
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Initial state based on direction
    let initialX = 0;
    let initialY = 0;

    switch (direction) {
      case "left":
        initialX = -50;
        break;
      case "right":
        initialX = 50;
        break;
      case "up":
        initialY = 50;
        break;
      case "down":
        initialY = -50;
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: initialX,
          y: initialY,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: delay + staggerIndex * 0.1, // Stagger effect
          scrollTrigger: {
            trigger: element,
            start: "top 85%", // Trigger when top of element hits 85% of viewport
            once: true, // Only animate once
          },
        }
      );
    });

    return () => ctx.revert();
  }, [direction, staggerIndex, delay]);

  return (
    <div ref={elementRef} className={cn("opacity-0", className)}>
      {children}
    </div>
  );
}
