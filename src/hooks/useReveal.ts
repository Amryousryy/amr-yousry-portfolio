"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 05: Reveal Primitive
 * 
 * Animates elements appearing on screen.
 * 
 * Pattern Origin: Logo Reveal, Status Message Reveal, Reveal Cinematic, Color Bridge, Camera Push
 * Behavioral Intent: Communicate entrance with appropriate emphasis
 * 
 * Usage:
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null);
 * const reveal = useReveal({
 *   ref: elementRef,
 *   variant: 'camera-push',
 *   duration: 'hero',
 *   easing: 'ease-out',
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

interface RevealOptions {
  ref: React.RefObject<HTMLElement | null>;
  variant: "fade" | "slide" | "scale" | "blur" | "focus-pull" | "camera-push";
  duration: DurationToken;
  easing?: EasingToken;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  scale?: number;
  blur?: number;
  autoPlay?: boolean;
}

interface RevealResult {
  play: () => Promise<void>;
  reverse: () => Promise<void>;
  reset: () => void;
  isVisible: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReveal(options: RevealOptions): RevealResult {
  const {
    ref,
    variant,
    duration,
    easing = "ease-out",
    delay = 0,
    direction = "up",
    distance = 8,
    scale: scaleValue = 0.96,
    blur: blurValue = 6,
    autoPlay = true,
  } = options;

  const animationRef = useRef<Animation | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const getKeyframes = useCallback((): Keyframe[] => {
    const directionMap = {
      up: { from: `translateY(${distance}px)`, to: "translateY(0)" },
      down: { from: `translateY(-${distance}px)`, to: "translateY(0)" },
      left: { from: `translateX(${distance}px)`, to: "translateX(0)" },
      right: { from: `translateX(-${distance}px)`, to: "translateX(0)" },
    };

    const dir = directionMap[direction];

    switch (variant) {
      case "fade":
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
      case "slide":
        return [
          { opacity: 0, transform: dir.from },
          { opacity: 1, transform: dir.to },
        ];
      case "scale":
        return [
          { opacity: 0, transform: `scale(${scaleValue})` },
          { opacity: 1, transform: "scale(1)" },
        ];
      case "blur":
        return [
          { opacity: 0, filter: `blur(${blurValue}px)` },
          { opacity: 1, filter: "blur(0)" },
        ];
      case "focus-pull":
        return [
          { opacity: 0, transform: `translateY(${distance}px) scale(${scaleValue})`, filter: `blur(${blurValue}px)` },
          { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
        ];
      case "camera-push":
        return [
          { opacity: 0, transform: `scale(1.03) translateY(${distance * 4}px)`, filter: "blur(3px)" },
          { opacity: 1, transform: "scale(1) translateY(0)", filter: "blur(0)" },
        ];
      default:
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
    }
  }, [variant, direction, distance, scaleValue, blurValue]);

  const play = useCallback(async (): Promise<void> => {
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    if (animationRef.current) {
      animationRef.current.cancel();
    }

    const durationMs = DURATION_MAP[duration];
    const easingStr = EASING_MAP[easing];
    const keyframes = getKeyframes();

    animationRef.current = ref.current.animate(keyframes, {
      duration: durationMs,
      easing: easingStr,
      delay,
      fill: "forwards",
    });

    await animationRef.current.finished;
    setIsVisible(true);
  }, [ref, duration, easing, delay, getKeyframes]);

  const reverse = useCallback(async (): Promise<void> => {
    if (!ref.current || !animationRef.current) return;

    if (prefersReducedMotion()) {
      setIsVisible(false);
      return;
    }

    animationRef.current.reverse();
    await animationRef.current.finished;
    setIsVisible(false);
  }, [ref]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      if (ref.current && !prefersReducedMotion()) {
        const durationMs = DURATION_MAP[duration];
        const easingStr = EASING_MAP[easing];
        const keyframes = getKeyframes();

        animationRef.current = ref.current.animate(keyframes, {
          duration: durationMs,
          easing: easingStr,
          delay,
          fill: "forwards",
        });

        animationRef.current.finished.then(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(true);
      }
    }
    return () => {
      reset();
    };
  }, [autoPlay, ref, duration, easing, delay, getKeyframes, reset]);

  return {
    play,
    reverse,
    reset,
    isVisible,
  };
}
