"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

/**
 * Creative Engine Boot Sequence v2
 * 
 * A retro pixel boot experience for the AMR YOUSRY brand.
 * Communicates creativity, craftsmanship, and premium quality.
 * 
 * Architecture:
 * - BootLoader: Orchestrates the entire sequence
 * - PixelMascot: Original pixel drone character
 * - EnergyCells: Retro pixel progress bar
 * - StatusMessages: Fading system messages
 * - TransitionController: Dissolves loader into Hero
 */

const SESSION_KEY = "ay-creative-engine-booted";
const BOOT_COMPLETED_EVENT = "creative-engine-boot-completed";
const BOOT_STARTED_EVENT = "creative-engine-boot-started";
const HERO_REVEALED_EVENT = "creative-engine-hero-revealed";

const STATUS_MESSAGES = [
  "Loading Creative Assets...",
  "Initializing Creative Engine...",
  "Optimizing Experience...",
  "Building Visual Environment...",
  "Rendering Portfolio...",
  "Preparing Interaction System...",
  "Finalizing Boot Sequence...",
  "Almost Ready...",
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function lockScroll() {
  try { document.body.classList.add("boot-locked"); } catch {}
}

function unlockScroll() {
  try { document.body.classList.remove("boot-locked"); } catch {}
}

function dispatchBootEvent(name: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch {}
}

/* ── Pixel Mascot: Original creative drone ── */
function PixelDrone({ frame }: { frame: number }) {
  const bob = Math.sin(frame * 0.08) * 2;
  const tilt = Math.sin(frame * 0.05) * 1.5;
  
  return (
    <div className="boot-drone" style={{ transform: `translateY(${bob}px) rotate(${tilt}deg)` }}>
      {/* Antenna */}
      <div className="boot-drone__antenna" />
      {/* Head */}
      <div className="boot-drone__head">
        <div className="boot-drone__eye" />
      </div>
      {/* Body */}
      <div className="boot-drone__body">
        <div className="boot-drone__core" />
      </div>
      {/* Wings */}
      <div className="boot-drone__wing boot-drone__wing--l" />
      <div className="boot-drone__wing boot-drone__wing--r" />
    </div>
  );
}

/* ── Energy Cells: 10 pixel blocks ── */
function EnergyCells({ count }: { count: number }) {
  return (
    <div className="boot-cells" aria-label={`Loading: ${count * 10}%`}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`boot-cell ${i < count ? "boot-cell--active" : ""}`}
          style={{ animationDelay: `${i * 30}ms` }}
        />
      ))}
    </div>
  );
}

/* ── Status Messages: Smooth fade cycle ── */
function StatusMessage({ message }: { message: string }) {
  return (
    <p className="boot-status" key={message}>
      {message}
    </p>
  );
}

export function CreativeEngineLoader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "done">("loading");
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState(0);
  const bootedRef = useRef(false);
  const bootStart = useRef(0);
  const rafRef = useRef(0);

  const complete = useCallback(() => {
    setPhase("complete");
    unlockScroll();
    try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
    dispatchBootEvent(BOOT_COMPLETED_EVENT, { duration: Date.now() - bootStart.current });
    setTimeout(() => {
      setPhase("done");
      requestAnimationFrame(() => dispatchBootEvent(HERO_REVEALED_EVENT));
    }, 600);
  }, []);

  /* Init: skip boot for returning visitors */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        bootedRef.current = true;
        queueMicrotask(() => setPhase("done"));
        return;
      }
    } catch {}
    if (prefersReducedMotion()) queueMicrotask(() => setReduced(true));
  }, []);

  /* Mascot animation loop */
  useEffect(() => {
    if (phase !== "loading" || reduced) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      setFrame(f => f + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [phase, reduced]);

  /* Boot sequence */
  useEffect(() => {
    if (bootedRef.current || phase !== "loading") return;
    lockScroll();
    bootStart.current = Date.now();
    dispatchBootEvent(BOOT_STARTED_EVENT);

    if (reduced) {
      const t = setTimeout(complete, 600);
      return () => { clearTimeout(t); unlockScroll(); };
    }

    const totalDuration = 2600;
    const messageInterval = 320;
    const steps = 10;
    const stepDuration = totalDuration / steps;

    /* Progress ticker */
    const progressTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= steps; i++) {
      progressTimers.push(
        setTimeout(() => setProgress(i), i * stepDuration)
      );
    }

    /* Message ticker */
    const messageTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STATUS_MESSAGES.length; i++) {
      messageTimers.push(
        setTimeout(() => setMessageIndex(i), i * messageInterval)
      );
    }

    /* Complete */
    const completeTimer = setTimeout(complete, totalDuration);

    return () => {
      unlockScroll();
      progressTimers.forEach(clearTimeout);
      messageTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [complete, phase, reduced]);

  if (phase === "done") return <>{children}</>;

  return (
    <>
      <div
        className={`boot-overlay ${phase === "complete" ? "boot-overlay--exit" : ""}`}
        role="status"
        aria-live="polite"
        aria-label="Loading creative engine"
      >
        {/* Scanline overlay */}
        <div className="boot-scanlines" aria-hidden="true" />

        {/* Grid background */}
        <div className="boot-grid" aria-hidden="true" />

        <div className="boot-content">
          {/* Logo */}
          <div className={`boot-logo ${reduced ? "" : "boot-logo--animate"}`}>
            <Image
              src="/images/logo.svg"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 md:w-12 md:h-12"
              unoptimized
              priority
            />
          </div>

          {/* Title */}
          <div className="boot-title">
            <h1 className="boot-title__name">AMR YOUSRY</h1>
            <p className="boot-title__sub">Creative Intelligence Engine</p>
          </div>

          {/* Status message */}
          {!reduced && <StatusMessage message={STATUS_MESSAGES[messageIndex]} />}

          {/* Energy cells progress */}
          <EnergyCells count={progress} />

          {/* Pixel mascot */}
          {!reduced && <PixelDrone frame={frame} />}

          {/* System status */}
          <p className="boot-system">
            {phase === "complete" ? "SYSTEM READY" : "BOOTING..."}
          </p>
        </div>
      </div>

      {/* Content (hidden during boot, visible during exit) */}
      <div style={{ visibility: phase === "complete" ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
