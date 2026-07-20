"use client";

import { useEffect, useState } from "react";
import type { WorldZone } from "@/types/world";
import { SECTION_ZONE_MAP } from "./section-zone-map";

export function useWorldSections(): WorldZone {
  const [activeZone, setActiveZone] = useState<WorldZone>("entrance");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        }
        if (maxEntry && maxRatio > 0.3) {
          const el = maxEntry.target as HTMLElement;
          const id = el.id || el.dataset.section || "";
          if (SECTION_ZONE_MAP[id]) setActiveZone(SECTION_ZONE_MAP[id]);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const id of Object.keys(SECTION_ZONE_MAP)) {
      const el = document.getElementById(id)
        || document.querySelector<HTMLElement>(`[data-section="${id}"]`)
        || document.querySelector<HTMLElement>(`[${id}]`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return activeZone;
}
