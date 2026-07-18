"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Sprint 04: Interaction Primitive
 * Sprint 09: Evidence-driven refinement
 *
 * Responds to user input.
 *
 * Pattern Origin: Button Press
 * Behavioral Intent: Provide physical feedback for user actions
 *
 * Usage (Sprint 04 — legacy):
 * ```tsx
 * const interaction = useInteraction({
 *   variant: 'press',
 *   duration: 'micro',
 *   scale: 0.95,
 * });
 *
 * return <button ref={interaction.ref} />;
 * ```
 *
 * Usage (Sprint 09 — ref-passing, consistent with other hooks):
 * ```tsx
 * const elementRef = useRef<HTMLButtonElement>(null);
 * useInteraction({
 *   ref: elementRef,
 *   variant: 'press',
 *   duration: 'micro',
 *   scale: 0.95,
 * });
 *
 * return <button ref={elementRef} />;
 * ```
 *
 * Usage (Sprint 09 — declarative handlers):
 * ```tsx
 * const interaction = useInteraction({
 *   variant: 'hover',
 *   duration: 'small',
 *   scale: 1.02,
 * });
 *
 * return <div {...interaction.handlers} />;
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

interface InteractionOptions {
  ref?: React.RefObject<HTMLElement | null>;
  variant: "hover" | "press" | "focus" | "drag";
  duration: DurationToken;
  easing?: EasingToken;
  scale?: number;
  translate?: { x: number; y: number };
}

interface InteractionHandlers {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

interface InteractionResult {
  ref: React.RefObject<HTMLElement | null>;
  bind: () => void;
  unbind: () => void;
  handlers: InteractionHandlers;
  isHovered: boolean;
  isPressed: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useInteraction(options: InteractionOptions): InteractionResult {
  const {
    ref: externalRef,
    variant,
    duration,
    easing = "ease-out",
    scale: scaleValue = 0.95,
    translate = { x: 0, y: 2 },
  } = options;

  const internalRef = useRef<HTMLElement | null>(null);
  const ref = externalRef || internalRef;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const handlersRef = useRef<{
    mouseEnter?: () => void;
    mouseLeave?: () => void;
    mouseDown?: () => void;
    mouseUp?: () => void;
    focus?: () => void;
    blur?: () => void;
  }>({});

  const getKeyframes = useCallback((): { enter: Keyframe[]; leave: Keyframe[] } => {
    switch (variant) {
      case "hover":
        return {
          enter: [
            { transform: "scale(1) translate(0, 0)" },
            { transform: `scale(${1 + (scaleValue - 1) * 0.5}) translate(${translate.x / 2}px, ${translate.y / 2}px)` },
          ],
          leave: [
            { transform: `scale(${1 + (scaleValue - 1) * 0.5}) translate(${translate.x / 2}px, ${translate.y / 2}px)` },
            { transform: "scale(1) translate(0, 0)" },
          ],
        };
      case "press":
        return {
          enter: [
            { transform: "scale(1) translate(0, 0)" },
            { transform: `scale(${scaleValue}) translate(${translate.x}px, ${translate.y}px)` },
          ],
          leave: [
            { transform: `scale(${scaleValue}) translate(${translate.x}px, ${translate.y}px)` },
            { transform: "scale(1) translate(0, 0)" },
          ],
        };
      case "focus":
        return {
          enter: [
            { boxShadow: "0 0 0px transparent" },
            { boxShadow: "0 0 0 2px rgba(34, 211, 238, 1)" },
          ],
          leave: [
            { boxShadow: "0 0 0 2px rgba(34, 211, 238, 1)" },
            { boxShadow: "0 0 0px transparent" },
          ],
        };
      case "drag":
        return {
          enter: [
            { transform: "scale(1) rotate(0deg)" },
            { transform: `scale(${scaleValue}) rotate(2deg)` },
          ],
          leave: [
            { transform: `scale(${scaleValue}) rotate(2deg)` },
            { transform: "scale(1) rotate(0deg)" },
          ],
        };
      default:
        return {
          enter: [{ transform: "scale(1)" }],
          leave: [{ transform: "scale(1)" }],
        };
    }
  }, [variant, scaleValue, translate]);

  const bind = useCallback(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const durationMs = DURATION_MAP[duration];
    const easingStr = EASING_MAP[easing];
    const { enter, leave } = getKeyframes();

    const handleMouseEnter = () => {
      setIsHovered(true);
      ref.current?.animate(enter, {
        duration: durationMs,
        easing: easingStr,
        fill: "forwards",
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPressed(false);
      ref.current?.animate(leave, {
        duration: durationMs,
        easing: easingStr,
        fill: "forwards",
      });
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleFocus = () => {
      if (variant === "focus") {
        handleMouseEnter();
      }
    };

    const handleBlur = () => {
      if (variant === "focus") {
        handleMouseLeave();
      }
    };

    handlersRef.current = {
      mouseEnter: handleMouseEnter,
      mouseLeave: handleMouseLeave,
      mouseDown: handleMouseDown,
      mouseUp: handleMouseUp,
      focus: handleFocus,
      blur: handleBlur,
    };

    ref.current.addEventListener("mouseenter", handleMouseEnter);
    ref.current.addEventListener("mouseleave", handleMouseLeave);
    ref.current.addEventListener("mousedown", handleMouseDown);
    ref.current.addEventListener("mouseup", handleMouseUp);
    ref.current.addEventListener("focus", handleFocus);
    ref.current.addEventListener("blur", handleBlur);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ref is stable (useRef)
  }, [duration, easing, getKeyframes, variant]);

  const unbind = useCallback(() => {
    if (!ref.current) return;

    const handlers = handlersRef.current;
    if (handlers.mouseEnter) ref.current.removeEventListener("mouseenter", handlers.mouseEnter);
    if (handlers.mouseLeave) ref.current.removeEventListener("mouseleave", handlers.mouseLeave);
    if (handlers.mouseDown) ref.current.removeEventListener("mousedown", handlers.mouseDown);
    if (handlers.mouseUp) ref.current.removeEventListener("mouseup", handlers.mouseUp);
    if (handlers.focus) ref.current.removeEventListener("focus", handlers.focus);
    if (handlers.blur) ref.current.removeEventListener("blur", handlers.blur);

    handlersRef.current = {};
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ref is stable (useRef)
  }, []);

  useEffect(() => {
    bind();
    return () => {
      unbind();
    };
  }, [bind, unbind]);

  const handlers: InteractionHandlers = {
    onMouseEnter: () => handlersRef.current.mouseEnter?.(),
    onMouseLeave: () => handlersRef.current.mouseLeave?.(),
    onMouseDown: () => handlersRef.current.mouseDown?.(),
    onMouseUp: () => handlersRef.current.mouseUp?.(),
    onFocus: () => handlersRef.current.focus?.(),
    onBlur: () => handlersRef.current.blur?.(),
  };

  return {
    ref,
    bind,
    unbind,
    handlers,
    isHovered,
    isPressed,
  };
}
