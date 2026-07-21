"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { WorldZone, WorldState, WorldTimeline as WorldTimelineType } from "@/types/world";
import { WorldContext } from "./WorldContext";
import WorldTimeline from "./WorldTimeline";
import Environment from "./Environment";

interface WorldRootProps {
  children?: ReactNode;
}

export default function WorldRoot({ children }: WorldRootProps) {
  const [timeline, setTimeline] = useState<WorldTimelineType>({
    currentZone: "entrance",
  });

  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.pageHidden = String(pageHidden);
  }, [pageHidden]);

  const updateZone = useCallback((zone: WorldZone) => {
    setTimeline((prev) => ({ ...prev, currentZone: zone }));
  }, []);

  const worldState: WorldState = {
    timeline,
    reducedMotion,
    pageHidden,
    activeTheme: "night",
  };

  return (
    <WorldContext.Provider value={{ state: worldState, updateZone }}>
      {isMobile ? (
        <div className="world-root world-root--mobile" data-theme={worldState.activeTheme} aria-hidden="true" />
      ) : (
        <div className="world-root" data-theme={worldState.activeTheme} data-zone={timeline.currentZone} aria-hidden="true">
          <WorldTimeline currentZone={timeline.currentZone} onZoneChange={updateZone}>
            <Environment />
          </WorldTimeline>
          <div className="world-connection" aria-hidden="true" />
        </div>
      )}
      {children}
    </WorldContext.Provider>
  );
}
