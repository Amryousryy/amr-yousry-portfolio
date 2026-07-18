"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 04: Transition Primitive
 * 
 * Animates state changes.
 * 
 * Pattern Origin: Progress Bar Glow
 * Behavioral Intent: Communicate progress or state evolution
 * 
 * Usage:
 * ```tsx
 * const transition = useTransition({
 *   variant: 'glow',
 *   duration: 'medium',
 * });
 * 
 * return <div ref={transition.ref} />;
 * ```
 */

type DurationToken = "micro" | "small" | "medium" | "large" | "hero";
type EasingToken = "ease-out" | "ease-in-out" | "ease-in-out-back" | "ease-out-expo" | "ease-spring";

const DURATION_MAP: Record<DurationToken, number> = {
  micro: 100,
  small: 200,
  medium: 300,
  large: 500,
  hero: 1000,
};

const EASING_MAP: Record<EasingToken, string> = {
  "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  "ease-in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
  "ease-out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
  "ease-spring": "spring(400, 10, 1)",
};

interface TransitionOptions {
  variant: "fade" | "slide" | "morph" | "glow";
  duration: DurationToken;
  easing?: EasingToken;
  from?: Record<string, string>;
  to?: Record<string, string>;
}

interface TransitionResult {
  ref: React.RefObject<HTMLElement | null>;
  play: () => Promise<void>;
  reverse: () => Promise<void>;
  isActive: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTransition(options: TransitionOptions): TransitionResult {
  const {
    variant,
    duration,
    easing = "ease-in-out",
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [isActive, setIsActive] = useState(false);

  const getKeyframes = useCallback((): Keyframe[] => {
    switch (variant) {
      case "fade":
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
      case "slide":
        return [
          { transform: "translateY(100%)" },
          { transform: "translateY(0)" },
        ];
      case "morph":
        return [
          { borderRadius: "0%" },
          { borderRadius: "50%" },
        ];
      case "glow":
        return [
          { boxShadow: "0 0 0px transparent" },
          { boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" },
        ];
      default:
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
    }
  }, [variant]);

  const play = useCallback(async (): Promise<void> => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      setIsActive(true);
      return;
    }

    const durationMs = DURATION_MAP[duration];
    const easingStr = EASING_MAP[easing];
    const keyframes = getKeyframes();

    animationRef.current = ref.current.animate(keyframes, {
      duration: durationMs,
      easing: easingStr,
      fill: "forwards",
    });

    setIsActive(true);
    await animationRef.current.finished;
    setIsActive(false);
  }, [duration, easing, getKeyframes]);

  const reverse = useCallback(async (): Promise<void> => {
    if (!ref.current || !animationRef.current) return;

    if (prefersReducedMotion()) {
      setIsActive(false);
      return;
    }

    animationRef.current.reverse();
    await animationRef.current.finished;
    setIsActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  return {
    ref,
    play,
    reverse,
    isActive,
  };
}