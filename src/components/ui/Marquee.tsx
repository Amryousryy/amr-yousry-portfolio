"use client";

import { useRef, useEffect, useState } from "react";

const CLIENTS = [
  { name: "Nile Towers", seed: "nile-towers" },
  { name: "AlRawabi", seed: "alrawabi-food" },
  { name: "DriveX", seed: "drivex-cars" },
  { name: "TechPulse", seed: "techpulse-eg" },
  { name: "North Coast", seed: "north-coast" },
  { name: "Mawjood", seed: "mawjood-tech" },
  { name: "Sahel Vibes", seed: "sahel-vibes" },
  { name: "CairoMotors", seed: "cairo-motors" },
];

export default function Marquee() {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-12 bg-[#050508] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="text-center">
          <div className="pixel-text text-white/50 text-xs mb-2">TRUSTED BY</div>
          <h3 className="font-sora text-2xl text-white">Brands I&apos;ve Worked With</h3>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-8 ${isPaused ? "" : "animate-marquee"}`}
          style={{
            animation: isPaused ? "none" : "marquee 30s linear infinite",
          }}
        >
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <div
              key={`${client.seed}-${i}`}
              className="flex-shrink-0 px-8 py-4 pixel-box bg-[#0a0a0f] hover:bg-[#00ffcc]/10 transition-colors cursor-pointer"
            >
              <span className="pixel-text text-white text-sm whitespace-nowrap">
                {client.name}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050508] to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050508] to-transparent z-10" />
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}