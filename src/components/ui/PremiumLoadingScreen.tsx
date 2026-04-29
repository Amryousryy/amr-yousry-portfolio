"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PremiumLoadingScreen() {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const pathname = usePathname();
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setIsComplete(true);
      return;
    }

    startTimeRef.current = Date.now();
    const totalDuration = 2500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Stage transitions
      if (elapsed > 800 && stage < 1) setStage(1);
      if (elapsed > 1600 && stage < 2) setStage(2);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => setIsComplete(true), 800);
        }, 500);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [pathname]);

  if (pathname.startsWith("/admin") || isComplete) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#050508] flex items-center justify-center transition-opacity duration-800 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Cinematic Film Reel Frame */}
      <div className="relative w-64 md:w-80 aspect-[3/4] max-h-[80vh]">
        {/* Film strip top */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white flex items-center overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="h-full flex-1"
              style={{
                background: i % 2 === 0 ? "#ffffff" : "#000000",
              }}
            />
          ))}
        </div>

        {/* Content area */}
        <div className="absolute top-12 left-0 right-0 bottom-12 bg-[#0a0a0f] flex flex-col items-center justify-center p-6">
          {/* Stage 0: Name */}
          <div
            className={`transition-all duration-500 ${
              stage >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="pixel-text text-[#00ffcc] text-[10px] mb-2 tracking-widest text-center">
              AMR YOUSRY
            </div>
          </div>

          {/* Stage 1: Title */}
          <div
            className={`mt-4 transition-all duration-500 delay-300 ${
              stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-mono text-white/40 text-[10px] tracking-wider text-center mb-1">
              CREATIVE STRATEGIST
            </div>
            <div className="text-mono text-[#00ffcc] text-[10px] tracking-wider text-center">
              & VIDEO EDITOR
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between mb-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-8 border-2 border-[#00ffcc] transition-colors duration-100"
                  style={{
                    background: progress >= (i + 1) * 10 ? "#00ffcc" : "transparent",
                  }}
                />
              ))}
            </div>
            <div className="w-full h-1.5 bg-[#1a1a2e]">
              <div
                className="h-full bg-[#00ffcc] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Film strip bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a1a] flex items-center overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 border-r border-[#050508]/20"
              style={{
                background: i % 2 === 0 ? "#ffffff" : "#000000",
              }}
            />
          ))}
        </div>

        {/* Perforation marks */}
        <div className="absolute top-12 left-0 w-4 h-8 -translate-x-full flex flex-col justify-around">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-2 border border-[#00ffcc]/30 rounded-sm" />
          ))}
        </div>
        <div className="absolute top-12 right-0 w-4 h-8 translate-x-full flex flex-col justify-around">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-2 border border-[#00ffcc]/30 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-12 text-center">
        <div className="pixel-text text-[#00ffcc] text-[10px] tracking-widest mb-2">
          LOADING REEL...
        </div>
        <div className="pixel-text text-white text-xl">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Exit animation */}
      {isExiting && (
        <div className="absolute inset-0 bg-white animate-burn pointer-events-none" />
      )}

      <style jsx>{`
        @keyframes burn {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-burn {
          animation: burn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
