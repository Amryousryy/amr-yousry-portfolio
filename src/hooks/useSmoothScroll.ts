"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export function useSmoothScroll() {
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      setScrollY(scroll);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return { scrollY, lenis: lenisRef.current };
}