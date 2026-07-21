"use client";

import { useMemo } from "react";
import type { RenderConfig } from "@/types/world";
import { mulberry32 } from "@/lib/seeded-random";

interface StarFieldProps {
  config: RenderConfig;
}

const MAX_STARS = 60;

interface StarConfig {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  baseOpacity: number;
  tint: "standard" | "warm" | "cool";
  blur: number;
}

const TINTS = ["standard", "warm", "cool"] as const;
const TINT_WEIGHTS = [0.6, 0.25, 0.15] as const;
const BLUR_LEVELS = [0, 0.5, 1] as const;
const BLUR_WEIGHTS = [0.5, 0.35, 0.15] as const;

function pickWeighted<T>(rng: () => number, options: readonly T[], weights: readonly number[]): T {
  const r = rng();
  let cumulative = 0;
  for (let i = 0; i < options.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return options[i];
  }
  return options[options.length - 1];
}

function generateStars(density: number, rng: () => number): StarConfig[] {
  const count = Math.round(density * MAX_STARS);
  const stars: StarConfig[] = [];

  for (let i = 0; i < count; i++) {
    const group = rng();
    let size: number, duration: [number, number], baseOpacity: [number, number], delay: [number, number];

    if (group < 0.2) {
      size = 2;
      duration = [1.5, 3];
      baseOpacity = [0.6, 0.8];
      delay = [0, 2];
    } else if (group < 0.7) {
      size = 1.5;
      duration = [2.5, 5];
      baseOpacity = [0.4, 0.6];
      delay = [0, 4];
    } else {
      size = 1;
      duration = [4, 8];
      baseOpacity = [0.2, 0.4];
      delay = [0, 8];
    }

    stars.push({
      x: rng() * 100,
      y: rng() * 60,
      size,
      duration: duration[0] + rng() * (duration[1] - duration[0]),
      delay: delay[0] + rng() * (delay[1] - delay[0]),
      baseOpacity: baseOpacity[0] + rng() * (baseOpacity[1] - baseOpacity[0]),
      tint: pickWeighted(rng, TINTS, TINT_WEIGHTS),
      blur: pickWeighted(rng, BLUR_LEVELS, BLUR_WEIGHTS),
    });
  }

  return stars;
}

function computeSeed(config: RenderConfig): number {
  let seed = Math.round(config.atmosphere.starDensity * 10000);
  const caps = config.capabilities;
  if (caps.city) seed += 1000;
  if (caps.cityLights) seed += 2000;
  if (caps.forest) seed += 3000;
  if (caps.energyGrid) seed += 4000;
  if (caps.observatory) seed += 5000;
  if (caps.comets) seed += 6000;
  if (caps.aurora) seed += 7000;
  return seed;
}

export default function StarField({ config }: StarFieldProps) {
  const stars = useMemo(
    () => generateStars(config.atmosphere.starDensity, mulberry32(computeSeed(config))),
    [config]
  );

  if (!config.capabilities.stars) return null;

  const tintColor: Record<string, string | undefined> = {
    warm: "#FCD34D",
    cool: "#67E8F9",
  };

  return (
    <>
      {stars.map((star, i) => {
        const style: React.CSSProperties = {
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.baseOpacity,
          animationDuration: `${star.duration}s`,
          animationDelay: `${star.delay}s`,
        };

        const color = tintColor[star.tint];
        if (color) style.background = color;
        if (star.blur) style.filter = `blur(${star.blur}px)`;

        return (
          <div
            key={i}
            className="world-star"
            style={style}
            aria-hidden="true"
          />
        );
      })}
    </>
  );
}
