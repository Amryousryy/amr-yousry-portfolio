"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 04: Focus Primitive
 * 
 * Draws attention to specific elements.
 * 
 * Pattern Origin: Terminal Ready, Element Focus
 * Behavioral Intent: Communicate importance or status
 * 
 * Usage:
 * ```tsx
 * const focus = useFocus({
 *   variant: 'flicker',
 *   duration: 'large',
 *   intensity: 0.7,
 * });
 * 
 * return <div ref={focus.ref} />;
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

interface FocusOptions {
  variant: "flicker" | "glow" | "pulse" | "highlight";
  duration: DurationToken;
  easing?: EasingToken;
  intensity?: number;
  color?: string;
  loop?: boolean;
}

interface FocusResult {
  ref: React.RefObject<HTMLElement | null>;
  play: () => Promise<void>;
  stop: () => void;
  isActive: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useFocus(options: FocusOptions): FocusResult {
  const {
    variant,
    duration,
    easing = "ease-out",
    intensity = 0.5,
    color = "rgba(34, 211, 238, 1)",
    loop = false,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [isActive, setIsActive] = useState(false);

  const getKeyframes = useCallback((): Keyframe[] => {
    switch (variant) {
      case "flicker":
        return [
          { opacity: 0 },
          { opacity: 0.7 },
          { opacity: 0.1 },
          { opacity: 0.6 },
          { opacity: 0.15 },
          { opacity: 0.5 },
          { opacity: 0.2 },
          { opacity: 0.65 },
          { opacity: 0.1 },
          { opacity: 0.55 },
          { opacity: 0.3 },
          { opacity: 0.5 },
          { opacity: 0.4 },
        ];
      case "glow":
        return [
          { boxShadow: `0 0 0px transparent` },
          { boxShadow: `0 0 ${20 * intensity}px ${color}` },
          { boxShadow: `0 0 0px transparent` },
        ];
      case "pulse":
        return [
          { transform: "scale(1)" },
          { transform: `scale(${1 + intensity * 0.05})` },
          { transform: "scale(1)" },
        ];
      case "highlight":
        return [
          { backgroundColor: "transparent" },
          { backgroundColor: `rgba(34, 211, 238, ${0.2 * intensity})` },
          { backgroundColor: "transparent" },
        ];
      default:
        return [
          { opacity: 1 },
          { opacity: 1 },
        ];
    }
  }, [variant, intensity, color]);

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
      iterations: loop ? Infinity : 1,
    });

    setIsActive(true);
    await animationRef.current.finished;
    setIsActive(false);
  }, [duration, easing, loop, getKeyframes]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    ref,
    play,
    stop,
    isActive,
  };
}