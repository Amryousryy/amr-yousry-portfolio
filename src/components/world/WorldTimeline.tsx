"use client";

import { useEffect, type ReactNode } from "react";
import type { WorldZone } from "@/types/world";
import { useWorldSections } from "./use-world-section";

interface WorldTimelineProps {
  currentZone: WorldZone;
  onZoneChange: (zone: WorldZone) => void;
  children?: ReactNode;
}

export default function WorldTimeline({ currentZone, onZoneChange, children }: WorldTimelineProps) {
  const observedZone = useWorldSections();

  useEffect(() => {
    if (observedZone !== currentZone) {
      onZoneChange(observedZone);
    }
  }, [observedZone, currentZone, onZoneChange]);

  return <>{children}</>;
}
