"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 05: Ambient Primitive
 * 
 * Creates subtle background animations that generate atmosphere.
 * 
 * Pattern Origin: Grid Breathing, Logo Breathing
 * Behavioral Intent: Maintain visual presence without attention grab
 * 
 * Usage:
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null);
 * const ambient = useAmbient({
 *   ref: elementRef,
 *   variant: 'breathe',
 *   duration: 'large',
 *   intensity: 0.5,
 *   properties: ['opacity'],
 * });
 * 
 * return <div ref={elementRef} />;
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

interface AmbientOptions {
  ref: React.RefObject<HTMLElement | null>;
  variant: "breathe" | "pulse" | "glow";
  duration: DurationToken;
  easing?: EasingToken;
  intensity?: number;
  properties?: ("opacity" | "scale" | "blur" | "glow")[];
  loop?: boolean;
}

interface AmbientResult {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isActive: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAmbient(options: AmbientOptions): AmbientResult {
  const {
    ref,
    variant,
    duration,
    easing = "ease-in-out",
    intensity = 0.5,
    properties = ["opacity"],
    loop = true,
  } = options;

  const animationRef = useRef<Animation | null>(null);
  const [isActive, setIsActive] = useState(false);

  const createKeyframes = useCallback(() => {
    const durationMs = DURATION_MAP[duration];
    const easingStr = EASING_MAP[easing];

    const keyframes: Keyframe[] = [];

    if (variant === "breathe") {
      if (properties.includes("opacity")) {
        keyframes.push(
          { opacity: 1 - intensity * 0.5 },
          { opacity: 1 },
          { opacity: 1 - intensity * 0.5 }
        );
      }
      if (properties.includes("scale")) {
        keyframes.push(
          { transform: `scale(${1 - intensity * 0.05})` },
          { transform: `scale(${1 + intensity * 0.05})` },
          { transform: `scale(${1 - intensity * 0.05})` }
        );
      }
      if (properties.includes("glow")) {
        keyframes.push(
          { filter: `drop-shadow(0 0 0px transparent)` },
          { filter: `drop-shadow(0 0 ${8 * intensity}px rgba(34, 211, 238, ${0.15 * intensity}))` },
          { filter: `drop-shadow(0 0 0px transparent)` }
        );
      }
    } else if (variant === "pulse") {
      if (properties.includes("opacity")) {
        keyframes.push(
          { opacity: 1 - intensity * 0.3 },
          { opacity: 1 },
          { opacity: 1 - intensity * 0.3 }
        );
      }
    } else if (variant === "glow") {
      if (properties.includes("glow")) {
        keyframes.push(
          { boxShadow: `0 0 0px transparent` },
          { boxShadow: `0 0 ${10 * intensity}px rgba(34, 211, 238, ${0.3 * intensity})` },
          { boxShadow: `0 0 0px transparent` }
        );
      }
    }

    return { keyframes, durationMs, easingStr };
  }, [variant, duration, easing, intensity, properties]);

  const start = useCallback(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const { keyframes, durationMs, easingStr } = createKeyframes();

    animationRef.current = ref.current.animate(keyframes, {
      duration: durationMs,
      easing: easingStr,
      iterations: loop ? Infinity : 1,
    });

    setIsActive(true);
  }, [ref, createKeyframes, loop]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
    setIsActive(false);
  }, []);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    pause,
    resume,
    isActive,
  };
}
