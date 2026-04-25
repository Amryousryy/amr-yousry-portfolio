"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";

function getReducedMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);

  const updateScroll = useCallback(({ scroll, limit }: { scroll: number; limit: number }) => {
    if (!tickingRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(scroll);
        setScrollProgress(Math.min(scroll / limit, 1));
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = getReducedMotionPreference();
    
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", updateScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, [updateScroll]);

  return { scrollY, scrollProgress, lenis: lenisRef.current };
}

export function useScrollSection(sectionRef: React.RefObject<HTMLElement>, onProgress: (progress: number) => void) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
      onProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRef, onProgress]);
}