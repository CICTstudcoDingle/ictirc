"use client";

import { useRef, useEffect, useState, useMemo } from "react";

interface HexCell {
  id: string;
  cx: number;
  cy: number;
  path: string;
  physics: {
    currentLift: number;
    velocity: number;
    activeColor: string;
  };
}

interface PhantomCursor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function HoneycombBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Config
  const R = 50;
  const GAP = 2;
  const EFFECT_RADIUS = 100;

  // Physics Config
  const SPRING_STIFFNESS = 0.03;
  const DAMPING = 0.95;
  const MAX_LIFT = 30;

  // Phantom Cursor Config
  const PHANTOM_SPEED = 1.5;
  const PHANTOM_WANDER_STRENGTH = 0.3;

  // Cells Ref
  const cellsRef = useRef<HexCell[]>([]);

  // DOM Refs
  const pathRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

  // 3 Phantom Cursors: Maroon, Gold, White
  const phantomCursorsRef = useRef<PhantomCursor[]>([
    { x: 200, y: 200, vx: 1, vy: 0.5, color: "#ff0040" },
    { x: 600, y: 400, vx: -0.8, vy: 1, color: "#ffc107" },
    { x: 1000, y: 300, vx: 0.5, vy: -1, color: "#ffffff" },
  ]);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Generate Grid
  useMemo(() => {
    const cells: HexCell[] = [];
    if (dimensions.width === 0) {
      cellsRef.current = [];
      return;
    }

    const W = Math.sqrt(3) * R;
    const H = 2 * R;
    const hexRadius = R - GAP;
    const hexWidth = Math.sqrt(3) * hexRadius;

    const colSpacing = W;
    const rowSpacing = H * 0.75;
    const cols = Math.ceil(dimensions.width / colSpacing) + 2;
    const rows = Math.ceil(dimensions.height / rowSpacing) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const isOddRow = row % 2 !== 0;
        const cx = col * colSpacing + (isOddRow ? colSpacing / 2 : 0);
        const cy = row * rowSpacing;

        const path = [
          `M ${cx} ${cy - hexRadius}`,
          `L ${cx + hexWidth / 2} ${cy - hexRadius / 2}`,
          `L ${cx + hexWidth / 2} ${cy + hexRadius / 2}`,
          `L ${cx} ${cy + hexRadius}`,
          `L ${cx - hexWidth / 2} ${cy + hexRadius / 2}`,
          `L ${cx - hexWidth / 2} ${cy - hexRadius / 2}`,
          "Z",
        ].join(" ");

        cells.push({
          id: `hex-${row}-${col}`,
          cx,
          cy,
          path,
          physics: { currentLift: 0, velocity: 0, activeColor: "#ff0040" },
        });
      }
    }
    cellsRef.current = cells;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const mouse = mouseRef.current;
      const phantoms = phantomCursorsRef.current;
      const { width, height } = dimensions;

      // Update Phantom Cursor Positions
      phantoms.forEach((phantom) => {
        phantom.vx += (Math.random() - 0.5) * PHANTOM_WANDER_STRENGTH;
        phantom.vy += (Math.random() - 0.5) * PHANTOM_WANDER_STRENGTH;

        const speed = Math.sqrt(phantom.vx ** 2 + phantom.vy ** 2);
        if (speed > PHANTOM_SPEED) {
          phantom.vx = (phantom.vx / speed) * PHANTOM_SPEED;
          phantom.vy = (phantom.vy / speed) * PHANTOM_SPEED;
        }

        phantom.x += phantom.vx;
        phantom.y += phantom.vy;

        if (phantom.x < 0 || phantom.x > width) phantom.vx *= -1;
        if (phantom.y < 0 || phantom.y > height) phantom.vy *= -1;

        phantom.x = Math.max(0, Math.min(width, phantom.x));
        phantom.y = Math.max(0, Math.min(height, phantom.y));
      });

      // Process each hex cell
      cellsRef.current.forEach((cell) => {
        let closestDist = Infinity;
        let closestIntensity = 0;
        let closestColor = "#ff0040";

        // Check real mouse
        const mouseDx = cell.cx - mouse.x;
        const mouseDy = cell.cy - mouse.y;
        const mouseDist = Math.sqrt(mouseDx ** 2 + mouseDy ** 2);
        if (mouseDist < EFFECT_RADIUS && mouseDist < closestDist) {
          closestDist = mouseDist;
          closestIntensity = Math.pow(1 - mouseDist / EFFECT_RADIUS, 2);
          closestColor = "#ff0040";
        }

        // Check phantoms
        phantoms.forEach((phantom) => {
          const dx = cell.cx - phantom.x;
          const dy = cell.cy - phantom.y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);
          if (dist < EFFECT_RADIUS && dist < closestDist) {
            closestDist = dist;
            closestIntensity = Math.pow(1 - dist / EFFECT_RADIUS, 2);
            closestColor = phantom.color;
          }
        });

        const target = closestIntensity * MAX_LIFT;
        cell.physics.activeColor = closestColor;

        // Spring Physics
        const force = (target - cell.physics.currentLift) * SPRING_STIFFNESS;
        cell.physics.velocity += force;
        cell.physics.velocity *= DAMPING;
        cell.physics.currentLift += cell.physics.velocity;

        if (
          Math.abs(cell.physics.currentLift) < 0.01 &&
          Math.abs(cell.physics.velocity) < 0.01 &&
          target === 0
        ) {
          cell.physics.currentLift = 0;
          cell.physics.velocity = 0;
        }

        // Render
        const element = pathRefs.current[cell.id];
        const underglowElement = pathRefs.current[`glow-${cell.id}`];

        if (element && underglowElement) {
          if (cell.physics.currentLift > 0.1 || cell.physics.velocity !== 0) {
            const lift = cell.physics.currentLift;
            const translateY = -lift;
            const scale = 1 + (lift / MAX_LIFT) * 0.1;

            element.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;

            const opacity = 0.2 + (lift / MAX_LIFT) * 0.8;
            element.style.opacity = opacity.toFixed(2);

            underglowElement.setAttribute("fill", closestColor);
            const glowOpacity = (lift / MAX_LIFT) * 0.8;
            underglowElement.style.opacity = glowOpacity.toFixed(2);

            if (lift > 1) {
              element.setAttribute("fill", "url(#metal-dark)");
              element.setAttribute("stroke", "#333");
              element.setAttribute("stroke-width", "1");
              element.style.filter = "url(#lift-shadow-deep)";
            }
          } else {
            if (element.style.transform !== "") {
              element.style.transform = "";
              element.style.opacity = "0.2";
              element.style.filter = "none";
              element.setAttribute("fill", "url(#metal-dark)");
              element.setAttribute("stroke", "rgba(255,255,255,0.03)");
              element.setAttribute("stroke-width", "0.5");
            }
            if (underglowElement.style.opacity !== "0") {
              underglowElement.style.opacity = "0";
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden z-0 bg-[#050505]"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metal-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#151515" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          <filter
            id="underglow-base"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="6"
              result="blur"
            />
          </filter>

          <filter
            id="lift-shadow-deep"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="15"
              stdDeviation="10"
              floodColor="#000"
              floodOpacity="1"
            />
          </filter>
        </defs>

        {/* Layer 1: Underglow */}
        <g>
          {cellsRef.current.map((cell) => (
            <path
              key={`glow-${cell.id}`}
              ref={(el) => {
                pathRefs.current[`glow-${cell.id}`] = el;
              }}
              d={cell.path}
              fill="#ff0040"
              stroke="none"
              filter="url(#underglow-base)"
              opacity="0"
              style={{
                transformOrigin: `${cell.cx}px ${cell.cy}px`,
                transform: `scale(0.9)`,
              }}
            />
          ))}
        </g>

        {/* Layer 2: Hex Tiles */}
        <g>
          {cellsRef.current.map((cell) => (
            <path
              key={cell.id}
              ref={(el) => {
                pathRefs.current[cell.id] = el;
              }}
              d={cell.path}
              fill="url(#metal-dark)"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
              style={{
                transformOrigin: `${cell.cx}px ${cell.cy}px`,
                opacity: 0.2,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
