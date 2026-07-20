"use client";

import { useEffect, useRef } from "react";
import type { RenderConfig } from "@/types/world";

interface WorldCometsProps {
  config: RenderConfig;
}

const MAX_SIMULTANEOUS_COMETS = 2;

export default function WorldComets({ config }: WorldCometsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCometsRef = useRef<Set<HTMLDivElement>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawn = () => {
    if (activeCometsRef.current.size >= MAX_SIMULTANEOUS_COMETS) return;

    const container = document.createElement("div");
    container.className = "world-comet";
    container.setAttribute("aria-hidden", "true");
    container.style.top = `${10 + Math.random() * 20}%`;
    container.style.setProperty("--comet-duration", `${3 + Math.random() * 3}s`);

    const core = document.createElement("div");
    core.className = "world-comet__core";

    const trail = document.createElement("div");
    trail.className = "world-comet__trail";

    const glow = document.createElement("div");
    glow.className = "world-comet__glow";

    container.appendChild(glow);
    container.appendChild(trail);
    container.appendChild(core);

    containerRef.current?.appendChild(container);
    activeCometsRef.current.add(container);

    const done = () => {
      container.remove();
      activeCometsRef.current.delete(container);
    };

    container.addEventListener("animationend", done);
  };

  useEffect(() => {
    if (
      !config.capabilities.comets ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const { cometFrequency } = config.atmosphere;
    if (cometFrequency <= 0) return;

    const activeComets = activeCometsRef.current;

    const schedule = () => {
      const min = cometFrequency * 0.5;
      const max = cometFrequency * 1.5;
      const delay = min + Math.random() * (max - min);
      timerRef.current = setTimeout(() => {
        spawn();
        schedule();
      }, delay);
    };

    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activeComets.forEach((el) => el.remove());
      activeComets.clear();
    };
  }, [config.capabilities.comets, config.atmosphere]);

  return <div ref={containerRef} aria-hidden="true" />;
}
