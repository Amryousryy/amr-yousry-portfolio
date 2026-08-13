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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with external media query on mount
    setReducedMotion(mq.matches);
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
    const sync = () => {
      if (document.hidden) {
        document.documentElement.dataset.pageHidden = "true";
      } else {
        delete document.documentElement.dataset.pageHidden;
      }
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

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
        </div>
      )}
      {children}
    </WorldContext.Provider>
  );
}
