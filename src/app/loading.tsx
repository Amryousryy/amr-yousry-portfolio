"use client";

import { useRef, useEffect } from "react";
import { useAmbient } from "@/hooks/behavior";

/**
 * Sprint 05: Global Loading — Route Transition
 * 
 * Migrated to use Behavior API:
 * - Loading bar pulse: useAmbient with pulse variant
 */
export default function Loading() {
  const barRef = useRef<HTMLDivElement>(null);

  const ambient = useAmbient({
    ref: barRef,
    variant: "pulse",
    duration: "large",
    easing: "ease-in-out",
    intensity: 0.8,
    properties: ["opacity"],
    loop: true,
  });

  useEffect(() => {
    ambient.start();
    return () => ambient.stop();
  }, [ambient]);

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-48 h-1 bg-white/10 mb-6 overflow-hidden">
        <div ref={barRef} className="h-full bg-brand-cyan" style={{ animation: "loadingBarFill 2s ease-in-out infinite" }} />
      </div>
      <p className="font-pixel text-[10px] text-text-dim uppercase tracking-widest">Loading...</p>
    </div>
  );
}
