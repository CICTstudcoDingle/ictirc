"use client";

/**
 * GSAP Exports for Next.js
 * 
 * Centralizes GSAP imports and plugin registration.
 * Components should import from this file instead of importing gsap directly.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger, useGSAP };
