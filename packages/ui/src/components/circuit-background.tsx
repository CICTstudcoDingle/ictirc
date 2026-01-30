"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CircuitBackgroundProps {
  variant?: "default" | "subtle" | "intense";
  animated?: boolean;
  className?: string;
}

export function CircuitBackground({
  variant = "default",
  animated = true,
  className = "",
}: CircuitBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const opacity = {
    subtle: 0.15,
    default: 0.3,
    intense: 0.5,
  }[variant];

  useEffect(() => {
    if (!animated || !svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".circuit-line");
    const particles = svgRef.current.querySelectorAll(".particle");

    // Animate circuit lines with flowing effect
    paths.forEach((path, i) => {
      const length = (path as SVGPathElement).getTotalLength?.() || 100;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2 + Math.random() * 2,
        delay: i * 0.1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // Animate particles with glow effect
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        opacity: 1,
        scale: 1.5,
        duration: 1 + Math.random(),
        delay: i * 0.2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      gsap.killTweensOf(paths);
      gsap.killTweensOf(particles);
    };
  }, [animated]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Maroon gradient for lines */}
          <linearGradient id="maroon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#800000" />
            <stop offset="100%" stopColor="#a00000" />
          </linearGradient>
          
          {/* Gold glow filter */}
          <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Maroon glow filter */}
          <filter id="maroon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Circuit Lines - Vertical drops */}
        <g stroke="url(#maroon-gradient)" strokeWidth="2" fill="none" filter="url(#maroon-glow)">
          <path className="circuit-line" d="M100,0 L100,200 L150,250 L150,400" />
          <path className="circuit-line" d="M200,0 L200,150 L250,200 L250,300 L200,350 L200,500" />
          <path className="circuit-line" d="M350,0 L350,100 L400,150 L400,350" />
          <path className="circuit-line" d="M500,0 L500,250 L550,300 L550,450 L500,500 L500,600" />
          <path className="circuit-line" d="M650,0 L650,180 L700,230 L700,380" />
          <path className="circuit-line" d="M800,0 L800,120 L850,170 L850,320 L800,370 L800,520" />
          <path className="circuit-line" d="M950,0 L950,200 L1000,250 L1000,400" />
          <path className="circuit-line" d="M1100,0 L1100,150 L1050,200 L1050,350 L1100,400 L1100,550" />
        </g>

        {/* Horizontal connectors */}
        <g stroke="url(#maroon-gradient)" strokeWidth="1.5" fill="none" filter="url(#maroon-glow)">
          <path className="circuit-line" d="M100,200 L200,200" />
          <path className="circuit-line" d="M250,300 L350,300" />
          <path className="circuit-line" d="M400,350 L500,350" />
          <path className="circuit-line" d="M550,450 L650,450" />
          <path className="circuit-line" d="M700,380 L800,380" />
          <path className="circuit-line" d="M850,320 L950,320" />
          <path className="circuit-line" d="M1000,400 L1100,400" />
        </g>

        {/* Connection nodes - Gold particles */}
        <g fill="#D4AF37" filter="url(#gold-glow)">
          <circle className="particle" cx="100" cy="200" r="4" opacity="0.5" />
          <circle className="particle" cx="200" cy="150" r="3" opacity="0.5" />
          <circle className="particle" cx="250" cy="300" r="4" opacity="0.5" />
          <circle className="particle" cx="350" cy="100" r="3" opacity="0.5" />
          <circle className="particle" cx="400" cy="350" r="4" opacity="0.5" />
          <circle className="particle" cx="500" cy="250" r="3" opacity="0.5" />
          <circle className="particle" cx="550" cy="450" r="4" opacity="0.5" />
          <circle className="particle" cx="650" cy="180" r="3" opacity="0.5" />
          <circle className="particle" cx="700" cy="380" r="4" opacity="0.5" />
          <circle className="particle" cx="800" cy="120" r="3" opacity="0.5" />
          <circle className="particle" cx="850" cy="320" r="4" opacity="0.5" />
          <circle className="particle" cx="950" cy="200" r="3" opacity="0.5" />
          <circle className="particle" cx="1000" cy="400" r="4" opacity="0.5" />
          <circle className="particle" cx="1100" cy="150" r="3" opacity="0.5" />
        </g>

        {/* Additional smaller particles for depth */}
        <g fill="#D4AF37" opacity="0.3">
          <circle className="particle" cx="150" cy="250" r="2" />
          <circle className="particle" cx="300" cy="180" r="2" />
          <circle className="particle" cx="450" cy="280" r="2" />
          <circle className="particle" cx="600" cy="350" r="2" />
          <circle className="particle" cx="750" cy="250" r="2" />
          <circle className="particle" cx="900" cy="400" r="2" />
          <circle className="particle" cx="1050" cy="280" r="2" />
        </g>

        {/* Maroon accent particles */}
        <g fill="#800000" filter="url(#maroon-glow)">
          <circle className="particle" cx="175" cy="320" r="3" opacity="0.6" />
          <circle className="particle" cx="425" cy="420" r="3" opacity="0.6" />
          <circle className="particle" cx="675" cy="280" r="3" opacity="0.6" />
          <circle className="particle" cx="925" cy="480" r="3" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
