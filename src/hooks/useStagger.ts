"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 05: Stagger Primitive
 * 
 * Animates multiple elements in sequence.
 * 
 * Pattern Origin: Element Focus (staggered)
 * Behavioral Intent: Create organized, rhythmic entrance
 * 
 * Usage:
 * ```tsx
 * const item1Ref = useRef<HTMLDivElement>(null);
 * const item2Ref = useRef<HTMLDivElement>(null);
 * const stagger = useStagger({
 *   refs: [item1Ref, item2Ref],
 *   variant: 'focus-pull',
 *   duration: 'large',
 *   stagger: 150,
 * });
 * 
 * return (
 *   <div>
 *     <div ref={item1Ref} />
 *     <div ref={item2Ref} />
 *   </div>
 * );
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

interface StaggerOptions {
  refs: React.RefObject<HTMLElement | null>[];
  variant: "fade" | "slide" | "scale" | "blur" | "focus-pull";
  duration: DurationToken;
  easing?: EasingToken;
  stagger: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

interface StaggerResult {
  play: () => Promise<void>;
  reverse: () => Promise<void>;
  reset: () => void;
  isVisible: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useStagger(options: StaggerOptions): StaggerResult {
  const {
    refs,
    variant,
    duration,
    easing = "ease-out",
    stagger,
    direction = "up",
    distance = 8,
  } = options;

  const animationsRef = useRef<Map<number, Animation>>(new Map());
  const refsRef = useRef(refs);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    refsRef.current = refs;
  });

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
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "scale(1)" },
        ];
      case "blur":
        return [
          { opacity: 0, filter: "blur(2px)" },
          { opacity: 1, filter: "blur(0)" },
        ];
      case "focus-pull":
        return [
          { opacity: 0, transform: `translateY(${distance}px)`, filter: "blur(2px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
        ];
      default:
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
    }
  }, [variant, direction, distance]);

  const play = useCallback(async (): Promise<void> => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    animationsRef.current.forEach((animation) => {
      animation.cancel();
    });
    animationsRef.current.clear();

    const durationMs = DURATION_MAP[duration];
    const easingStr = EASING_MAP[easing];
    const keyframes = getKeyframes();

    const currentRefs = refsRef.current;
    const animations: Promise<Animation>[] = [];

    currentRefs.forEach((ref, index) => {
      if (ref.current) {
        const animation = ref.current.animate(keyframes, {
          duration: durationMs,
          easing: easingStr,
          delay: index * stagger,
          fill: "forwards",
        });

        animationsRef.current.set(index, animation);
        animations.push(animation.finished);
      }
    });

    await Promise.all(animations);
    setIsVisible(true);
  }, [duration, easing, stagger, getKeyframes]);

  const reverse = useCallback(async (): Promise<void> => {
    if (prefersReducedMotion()) {
      setIsVisible(false);
      return;
    }

    const animations: Promise<Animation>[] = [];

    animationsRef.current.forEach((animation) => {
      animation.reverse();
      animations.push(animation.finished);
    });

    await Promise.all(animations);
    setIsVisible(false);
  }, []);

  const reset = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      animation.cancel();
    });
    animationsRef.current.clear();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    play,
    reverse,
    reset,
    isVisible,
  };
}
