"use client";

import { useMemo } from "react";
import type { RenderConfig } from "@/types/world";

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

function pickWeighted<T>(options: readonly T[], weights: readonly number[]): T {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < options.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return options[i];
  }
  return options[options.length - 1];
}

function generateStars(density: number): StarConfig[] {
  const count = Math.round(density * MAX_STARS);
  const stars: StarConfig[] = [];

  for (let i = 0; i < count; i++) {
    const group = Math.random();
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
      x: Math.random() * 100,
      y: Math.random() * 60,
      size,
      duration: duration[0] + Math.random() * (duration[1] - duration[0]),
      delay: delay[0] + Math.random() * (delay[1] - delay[0]),
      baseOpacity: baseOpacity[0] + Math.random() * (baseOpacity[1] - baseOpacity[0]),
      tint: pickWeighted(TINTS, TINT_WEIGHTS),
      blur: pickWeighted(BLUR_LEVELS, BLUR_WEIGHTS),
    });
  }

  return stars;
}

export default function StarField({ config }: StarFieldProps) {
  const stars = useMemo(
    () => generateStars(config.atmosphere.starDensity),
    [config.atmosphere.starDensity]
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
