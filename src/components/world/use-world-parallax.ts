"use client";

import { useEffect } from "react";

const LERP = 0.08;
const MAX_OFFSET = 8;

export function useWorldParallax(): void {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 639px)").matches) return;

    const root = document.querySelector<HTMLElement>(".world-root");
    if (!root) return;

    const tablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const maxOffset = tablet.matches ? MAX_OFFSET * 0.5 : MAX_OFFSET;

    let rafId: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouse = (e: MouseEvent) => {
      target.x = ((e.clientX / window.innerWidth) - 0.5) * 2 * maxOffset;
      target.y = ((e.clientY / window.innerHeight) - 0.5) * 2 * maxOffset;
    };

    const animate = () => {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      root.style.setProperty("--parallax-x", String(Math.round(current.x * 100) / 100));
      root.style.setProperty("--parallax-y", String(Math.round(current.y * 100) / 100));
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(rafId);
      root.style.removeProperty("--parallax-x");
      root.style.removeProperty("--parallax-y");
    };
  }, []);
}
