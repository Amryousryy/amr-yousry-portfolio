"use client";

import { useRef, useEffect } from "react";
import { useAmbient } from "@/hooks/behavior";

/**
 * Sprint 05: Marketing Loading — Route Transition
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0A0A0F]/90 pixel-grid">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-cyan/40 relative">
          <div className="absolute inset-0 bg-brand-cyan/20 animate-pulse" />
          <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-brand-cyan/60" />
          <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-brand-cyan/60" />
          <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-brand-cyan/60" />
          <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-brand-cyan/60" />
        </div>
        <div className="w-32 h-1 border border-brand-cyan/30 p-[1px] bg-[#0A0A0F]">
          <div ref={barRef} className="h-full bg-brand-cyan/60 animate-[loadingBarFill_1s_ease-in-out_infinite]" />
        </div>
        <p className="font-pixel text-brand-cyan/50 text-[7px] tracking-[0.3em]">
          LOADING
        </p>
      </div>
    </div>
  );
}
