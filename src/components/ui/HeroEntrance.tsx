"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useReveal } from "@/hooks/behavior";

/**
 * Sprint 05: Hero Entrance — Cinematic World Birth
 * 
 * This component wraps the HeroSection to create a seamless transition
 * from the boot loader. The hero content starts invisible, then animates
 * in when the boot completes.
 * 
 * Migrated to use Behavior API:
 * - Camera push: useReveal with camera-push variant
 * - Focus pull: useReveal with focus-pull variant
 * - Color bridge: handled via CSS for backward compatibility
 * - Staggered reveals: handled by child components
 */
const BOOT_EVENT = "creative-engine-booted";
const SESSION_KEY = "ay-creative-engine-booted";

export function HeroEntrance({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "entering" | "visible">("hidden");
  const elementRef = useRef<HTMLDivElement>(null);

  const reveal = useReveal({
    ref: elementRef,
    variant: "camera-push",
    duration: "hero",
    easing: "ease-out",
    autoPlay: false,
  });

  const handleBoot = useCallback(() => {
    setPhase("entering");
    reveal.play().then(() => {
      setVisible(true);
      setPhase("visible");
    });
  }, [reveal]);

  useEffect(() => {
    // Already booted (returning visitor)
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        queueMicrotask(() => {
          setVisible(true);
          setPhase("visible");
        });
        return;
      }
    } catch {}

    // Listen for boot completion from CreativeEngineLoader
    window.addEventListener(BOOT_EVENT, handleBoot);
    return () => window.removeEventListener(BOOT_EVENT, handleBoot);
  }, [handleBoot]);

  return (
    <div
      ref={elementRef}
      className={`hero-entrance hero-entrance--${phase}`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
