"use client";

import { useEffect, useState, useCallback } from "react";

type BootPhase =
  | "init"
  | "booting"
  | "missions"
  | "pixels"
  | "reveal"
  | "done";

const MESSAGES: Record<BootPhase, string | null> = {
  init: null,
  booting: "BOOTING CREATIVE ENGINE...",
  missions: "LOADING MISSIONS...",
  pixels: "ALIGNING PIXELS...",
  reveal: null,
  done: null,
};

const PROGRESS: Record<BootPhase, number> = {
  init: 0,
  booting: 28,
  missions: 57,
  pixels: 83,
  reveal: 100,
  done: 100,
};

const SESSION_KEY = "ay-creative-engine-booted";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CreativeEngineLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<BootPhase>("init");
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const complete = useCallback(() => {
    setPhase("done");
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(false);
      });
    });
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());

    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setVisible(false);
        setPhase("done");
        return;
      }
    } catch {}

    if (prefersReducedMotion()) {
      setPhase("reveal");
      const t = setTimeout(complete, 600);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setPhase("booting"), 80);
    const t2 = setTimeout(() => setPhase("missions"), 480);
    const t3 = setTimeout(() => setPhase("pixels"), 920);
    const t4 = setTimeout(() => setPhase("reveal"), 1280);
    const t5 = setTimeout(complete, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [complete]);

  if (!visible) return <>{children}</>;

  const progress = PROGRESS[phase];
  const message = MESSAGES[phase];
  const showLoader = phase !== "done";

  return (
    <>
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0F] transition-opacity duration-500 ${
          phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Pixel grid background */}
        <div className="absolute inset-0 game-grid-bg opacity-15 pointer-events-none" />

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          }}
        />

        <div className="relative z-20 flex flex-col items-center gap-8 px-4 w-full max-w-sm">
          {/* Logo */}
          <div className="relative">
            <img
              src="/images/logo.svg"
              alt="AMR YOUSRY"
              className="w-12 h-12 md:w-14 md:h-14 opacity-60"
            />
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-brand-cyan/60" />
          </div>

          {showLoader && phase !== "reveal" && (
            <div className="flex flex-col items-center gap-5 w-full">
              {/* Status message */}
              <p
                className="font-pixel text-brand-cyan/80 text-[9px] md:text-[10px] tracking-[0.25em] h-4 transition-opacity duration-300"
                style={{
                  opacity: message ? 1 : 0,
                }}
              >
                {message || ""}
              </p>

              {/* Pixel loading bar */}
              <div className="w-full border-2 border-brand-cyan/40 p-1 bg-[#0A0A0F]">
                <div className="relative h-3 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-cyan/80 transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      imageRendering: "pixelated",
                      boxShadow: "0 0 8px rgba(34, 211, 238, 0.25)",
                    }}
                  >
                    {/* Pixel segments */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.12) 6px, rgba(0,0,0,0.12) 8px)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Percentage */}
              <p className="font-pixel text-brand-cyan/50 text-[8px] tracking-widest">
                {progress}%
              </p>
            </div>
          )}

          {/* Reveal — MAKE IDEAS MATTER */}
          {phase === "reveal" && (
            <div className="flex flex-col items-center gap-4">
              {/* Pulsing dot */}
              <div className="w-2 h-2 bg-brand-cyan/70 rounded-full animate-pulse" />

              <div
                className="flex flex-col items-center gap-1 border-2 border-brand-cyan/30 px-8 py-5"
                style={{
                  animation: reduced
                    ? "none"
                    : "glitchReveal 1s ease-out forwards, flickerIn 0.8s ease-out",
                  boxShadow:
                    "0 0 20px rgba(34, 211, 238, 0.08), inset 0 0 20px rgba(34, 211, 238, 0.03)",
                }}
              >
                <span
                  className="font-pixel text-brand-cyan text-[clamp(1.1rem,5vw,1.6rem)] tracking-[0.15em] leading-tight text-center"
                  style={{
                    textShadow:
                      "0 0 12px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.1)",
                  }}
                >
                  MAKE IDEAS
                </span>
                <span
                  className="font-pixel text-brand-cyan text-[clamp(1.1rem,5vw,1.6rem)] tracking-[0.15em] leading-tight text-center"
                  style={{
                    textShadow:
                      "0 0 12px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.1)",
                  }}
                >
                  MATTER
                </span>
              </div>

              <p
                className="font-pixel text-brand-cyan/40 text-[7px] tracking-[0.35em] uppercase"
                style={{
                  animation: reduced ? "none" : "flickerIn 1.5s ease-out",
                }}
              >
                SYSTEM READY
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content is rendered underneath but hidden by loader */}
      <div className={phase !== "done" ? "sr-only" : ""}>{children}</div>
    </>
  );
}
