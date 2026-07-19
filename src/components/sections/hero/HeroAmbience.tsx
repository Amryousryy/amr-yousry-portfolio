"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * HeroAmbience — Cursor-reactive glow
 *
 * v4: Light that follows, never leads.
 * Fades in when entering hero, fades out when leaving.
 * Lags naturally behind cursor. Never snaps.
 */
export function HeroAmbience() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);

  const setActive = useCallback((active: boolean) => {
    activeRef.current = active;
    const glow = glowRef.current;
    if (!glow) return;
    if (active) {
      glow.classList.add("hero-cursor-glow--active");
    } else {
      glow.classList.remove("hero-cursor-glow--active");
    }
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const section = document.querySelector('[data-hero-section]');
    if (!section) return;

    const handleMouseMove = (e: Event) => {
      const me = e as MouseEvent;
      const rect = (me.currentTarget as HTMLElement).getBoundingClientRect();
      targetRef.current.x = me.clientX - rect.left;
      targetRef.current.y = me.clientY - rect.top;
    };

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);

    const tick = () => {
      const glow = glowRef.current;
      if (!glow) return;

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.03;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.03;

      glow.style.transform = `translate(${currentRef.current.x - 225}px, ${currentRef.current.y - 225}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setActive]);

  return (
    <div
      ref={glowRef}
      className="hero-cursor-glow"
      aria-hidden="true"
    />
  );
}
