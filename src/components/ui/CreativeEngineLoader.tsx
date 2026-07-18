"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useAmbient, useReveal } from "@/hooks/behavior";

/**
 * Sprint 05: 7-Stage Experience Model
 * 
 * Stage 1: Arrival — User enters the experience
 * Stage 2: System Awakening — The system comes alive
 * Stage 3: Identity Reveal — Brand identity is established
 * Stage 4: Hero Narrative — Core message is communicated
 * Stage 5: Interaction — User engages with the experience
 * Stage 6: Narrative Exit — User leaves the experience
 * Stage 7: Memory Formation — Experience becomes memory
 * 
 * Migrated to use Behavior API:
 * - Logo breathing: useAmbient with breathe variant
 * - Status message reveal: useReveal with fade variant
 * - Reveal text: useReveal with focus-pull variant
 */
type BootPhase =
  | "arrival"
  | "awakening"
  | "identity"
  | "narrative"
  | "interaction"
  | "exit"
  | "memory"
  | "done";

const MESSAGES: Record<BootPhase, string | null> = {
  arrival: null,
  awakening: "BOOTING CREATIVE ENGINE...",
  identity: "LOADING MISSIONS...",
  narrative: "ALIGNING PIXELS...",
  interaction: null,
  exit: null,
  memory: null,
  done: null,
};

const PROGRESS: Record<BootPhase, number> = {
  arrival: 0,
  awakening: 28,
  identity: 57,
  narrative: 83,
  interaction: 100,
  exit: 100,
  memory: 100,
  done: 100,
};

const SESSION_KEY = "ay-creative-engine-booted";
const BOOT_EVENT = "creative-engine-booted";
const BOOT_STARTED_EVENT = "creative-engine-boot-started";
const BOOT_STAGE_EVENT = "creative-engine-boot-stage";
const BOOT_COMPLETED_EVENT = "creative-engine-boot-completed";
const HERO_REVEALED_EVENT = "creative-engine-hero-revealed";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function lockScroll() {
  try {
    document.body.classList.add("boot-locked");
  } catch {}
}

function unlockScroll() {
  try {
    document.body.classList.remove("boot-locked");
  } catch {}
}

function dispatchBootEvent(name: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {}
}

export function CreativeEngineLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<BootPhase>("arrival");
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const bootedRef = useRef(false);
  const bootStartTime = useRef(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);

  const logoAmbient = useAmbient({
    ref: logoRef,
    variant: "breathe",
    duration: "large",
    easing: "ease-in-out",
    intensity: 0.3,
    properties: ["opacity", "glow"],
    loop: true,
  });

  const revealText = useReveal({
    ref: revealTextRef,
    variant: "focus-pull",
    duration: "large",
    easing: "ease-out",
    autoPlay: false,
  });

  const complete = useCallback(() => {
    setPhase("done");
    unlockScroll();
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
    const duration = Date.now() - bootStartTime.current;
    dispatchBootEvent(BOOT_COMPLETED_EVENT, { duration });
    dispatchBootEvent(BOOT_EVENT);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(false);
        // Dispatch hero revealed after content becomes visible
        requestAnimationFrame(() => {
          dispatchBootEvent(HERO_REVEALED_EVENT);
        });
      });
    });
  }, []);

  // Init effect: corrects SSR-borne state before first paint.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        bootedRef.current = true;
        queueMicrotask(() => {
          setPhase("done");
          setVisible(false);
        });
        return; // Skip scroll lock for returning visitors
      }
    } catch {}

    if (prefersReducedMotion()) {
      queueMicrotask(() => {
        setReduced(true);
      });
    }
  }, []);

  // Boot sequence — fires once on mount.
  useEffect(() => {
    if (bootedRef.current) return;

    // Lock scroll during boot
    lockScroll();
    bootStartTime.current = Date.now();
    dispatchBootEvent(BOOT_STARTED_EVENT);

    if (prefersReducedMotion()) {
      queueMicrotask(() => {
        setPhase("narrative");
        dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "narrative", progress: 83 });
      });
      const t = setTimeout(complete, 600);
      return () => clearTimeout(t);
    }

    // Stage 1: Arrival (0-300ms)
    const t1 = setTimeout(() => {
      setPhase("awakening");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "awakening", progress: 28 });
    }, 300);
    // Stage 2: System Awakening (300-900ms)
    const t2 = setTimeout(() => {
      setPhase("identity");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "identity", progress: 57 });
    }, 900);
    // Stage 3: Identity Reveal (900-1500ms)
    const t3 = setTimeout(() => {
      setPhase("narrative");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "narrative", progress: 83 });
    }, 1500);
    // Stage 4: Hero Narrative (1500-2000ms)
    const t4 = setTimeout(() => {
      setPhase("interaction");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "interaction", progress: 100 });
    }, 2000);
    // Stage 5: Interaction (2000-2300ms)
    const t5 = setTimeout(() => {
      setPhase("exit");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "exit", progress: 100 });
    }, 2300);
    // Stage 6: Narrative Exit (2300-2600ms)
    const t6 = setTimeout(() => {
      setPhase("memory");
      dispatchBootEvent(BOOT_STAGE_EVENT, { stage: "memory", progress: 100 });
    }, 2600);
    // Stage 7: Memory Formation (2600-2800ms)
    const t7 = setTimeout(complete, 2800);

    return () => {
      unlockScroll();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [complete]);

  // Start logo ambient animation when phase is awakening
  useEffect(() => {
    if (phase === "awakening" || phase === "identity" || phase === "narrative") {
      logoAmbient.start();
    } else {
      logoAmbient.stop();
    }
  }, [phase, logoAmbient]);

  // Play reveal text animation when phase is narrative
  useEffect(() => {
    if (phase === "narrative" || phase === "interaction" || phase === "exit" || phase === "memory") {
      revealText.play();
    }
  }, [phase, revealText]);

  // Handle tab visibility — skip boot if user returns after tab was hidden
  useEffect(() => {
    if (bootedRef.current) return;

    function handleVisibility() {
      if (document.visibilityState === "visible" && !bootedRef.current) {
        // Tab restored — if boot has been running, complete it
        if (bootStartTime.current > 0) {
          const elapsed = Date.now() - bootStartTime.current;
          if (elapsed > 1500) {
            // Boot was mid-sequence when tab was hidden — complete immediately
            complete();
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [complete]);

  if (!visible) return <>{children}</>;

  const progress = PROGRESS[phase];
  const message = MESSAGES[phase];
  const showLoader = phase !== "done" && phase !== "narrative" && phase !== "interaction" && phase !== "exit" && phase !== "memory";
  const isRevealing = phase === "narrative" || phase === "interaction" || phase === "exit" || phase === "memory";

  return (
    <>
      <div
        className={`boot-overlay ${phase === "done" ? "boot-overlay--hidden" : ""}`}
        aria-hidden="true"
      >
        {/* Pixel grid background — breathing */}
        <div className="absolute inset-0 game-grid-bg pointer-events-none" style={{ zIndex: 1 }} />

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 2,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-sm">
          {/* Logo — cinematic entrance (now using Behavior API) */}
          <div ref={logoRef} className={`logo-container relative ${reduced ? "" : "logo-container--animate"}`}>
            <Image
              src="/images/logo.svg"
              alt="AMR YOUSRY"
              width={48}
              height={48}
              className="w-12 h-12 md:w-14 md:h-14"
              unoptimized
              priority
            />
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-brand-cyan/60" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-brand-cyan/60" />
          </div>

          {/* Loading phase */}
          {showLoader && (
            <div className="boot-loading flex flex-col items-center gap-5 w-full">
              {/* Status message — cinematic reveal */}
              <p
                className="boot-status-message font-pixel text-brand-cyan/80 text-[9px] md:text-[10px] tracking-[0.25em] h-4"
                key={phase}
              >
                {message || ""}
              </p>

              {/* Pixel loading bar — enhanced glow */}
              <div className="w-full border-2 border-brand-cyan/40 p-1 bg-brand-blue">
                <div className="relative h-3 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-cyan/80 boot-progress-glow"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      imageRendering: "pixelated",
                      transition: "width 600ms cubic-bezier(0.16, 1, 0.3, 1)",
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

              {/* Narrative status — SYSTEMS NOMINAL */}
              <p className="font-pixel text-brand-cyan/40 text-[8px] tracking-widest">
                SYSTEMS NOMINAL
              </p>
            </div>
          )}

          {/* Reveal — MAKE IDEAS MATTER (now using Behavior API) */}
          {isRevealing && (
            <div ref={revealTextRef} className={`flex flex-col items-center gap-4 ${reduced ? "" : "boot-reveal"}`}>
              <div className="flex flex-col items-center gap-1 border-2 border-brand-cyan/30 px-8 py-5 boot-reveal-box">
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

              <p className="font-pixel text-brand-cyan/40 text-[7px] tracking-[0.35em] uppercase boot-system-ready">
                SYSTEM READY
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content hidden during loader — visibility hidden prevents CLS */}
      <div style={{ visibility: phase !== "done" ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
