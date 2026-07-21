"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

const SESSION_KEY = "ay-creative-engine-booted";
const CELL_COUNT = 12;
const EXIT_FADE_MS = 350;

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

export function CreativeEngineLoader({ children }: { children: React.ReactNode }) {
  const [activeCells, setActiveCells] = useState(0);
  const [phase, setPhase] = useState<"loading" | "ready" | "exiting" | "done">("loading");
  const bootedRef = useRef(false);
  const completingRef = useRef(false);
  const startTimeRef = useRef(0);

  const complete = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    setPhase("exiting");
    unlockScroll();
    try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
    setTimeout(() => setPhase("done"), EXIT_FADE_MS);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        bootedRef.current = true;
        queueMicrotask(() => setPhase("done"));
        return;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (bootedRef.current) return;
    lockScroll();
    startTimeRef.current = Date.now();

    if (prefersReducedMotion()) {
      const t = setTimeout(complete, 800);
      return () => { clearTimeout(t); unlockScroll(); };
    }

    const MIN_DURATION = 1600;
    const MAX_DURATION = 2600;
    const CELL_START_DELAY = 600;
    const CELL_INTERVAL = 100;
    const READY_DURATION = 450;

    const CHOREOGRAPHY_END = CELL_START_DELAY + CELL_COUNT * CELL_INTERVAL;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= CELL_COUNT; i++) {
      timers.push(
        setTimeout(() => setActiveCells(i), CELL_START_DELAY + i * CELL_INTERVAL)
      );
    }

    timers.push(setTimeout(() => setPhase("ready"), CHOREOGRAPHY_END));

    timers.push(setTimeout(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= MIN_DURATION) {
        complete();
      } else {
        timers.push(setTimeout(complete, MIN_DURATION - elapsed));
      }
    }, CHOREOGRAPHY_END + READY_DURATION));

    timers.push(setTimeout(complete, MAX_DURATION));

    return () => {
      timers.forEach(clearTimeout);
      unlockScroll();
    };
  }, [complete]);

  if (phase === "done") return <>{children}</>;

  return (
    <>
      <div
        className={`boot-overlay${phase === "ready" ? " boot-overlay--ready" : ""}${phase === "exiting" ? " boot-overlay--exit" : ""}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="boot-scanlines" aria-hidden="true" />
        <div className="boot-stars" aria-hidden="true" />
        <div className="boot-grid" aria-hidden="true" />

        <div className="boot-content">
          <div className="boot-logo">
            <Image
              src="/images/logo.svg"
              alt="AMR YOUSRY"
              width={72}
              height={72}
              className="boot-logo-img"
              unoptimized
              priority
            />
          </div>

          <p className="boot-tagline">MAKE IDEAS MATTER</p>

          <div className="boot-bar-frame">
            <div
              className={`boot-bar${phase === "ready" || phase === "exiting" ? " boot-bar--ready" : ""}`}
              role="progressbar"
              aria-valuenow={activeCells}
              aria-valuemin={0}
              aria-valuemax={CELL_COUNT}
            >
              {Array.from({ length: CELL_COUNT }, (_, i) => (
                <div
                  key={i}
                  className={`boot-cell${i < activeCells ? " boot-cell--active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`boot-portfolio${phase === "exiting" ? " boot-portfolio--enter" : ""}`}
        aria-hidden={phase === "loading" || phase === "ready"}
      >
        {children}
      </div>
    </>
  );
}
