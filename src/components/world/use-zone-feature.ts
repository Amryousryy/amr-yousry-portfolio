"use client";

import { useState, useCallback } from "react";

export type ZoneFeaturePhase = "hidden" | "entering" | "visible" | "exiting";

export function useZoneFeature(active: boolean) {
  const [phase, setPhase] = useState<ZoneFeaturePhase>(
    () => (active ? "entering" : "hidden")
  );
  const [prevActive, setPrevActive] = useState(active);

  if (active !== prevActive) {
    setPrevActive(active);
    setPhase(active ? "entering" : "exiting");
  }

  const onAnimationEnd = useCallback(() => {
    setPhase((current) => {
      if (current === "entering") return "visible";
      if (current === "exiting") return "hidden";
      return current;
    });
  }, []);

  return {
    shouldRender: phase !== "hidden",
    phase,
    onAnimationEnd,
  };
}
