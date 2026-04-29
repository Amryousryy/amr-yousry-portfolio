"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface LoadingScreenProps {
  minDuration?: number;
}

export default function LoadingScreen({ minDuration = 2500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();
  const hasShownRef = useRef(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setIsComplete(true);
      return;
    }
    if (hasShownRef.current) {
      setIsComplete(true);
      return;
    }

    hasShownRef.current = true;
    startTimeRef.current = Date.now();

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setIsComplete(true), 800);
      }, 100);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => setIsComplete(true), 800);
        }, 500);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [minDuration, pathname]);

  if (pathname.startsWith("/admin") || isComplete) return null;

  return (
    <div className={`fixed inset-0 z-[10000] bg-[#050508] flex flex-col items-center justify-center transition-opacity duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}>
      <div className="mb-8">
        <div className="relative w-48 h-36">
          <div className="absolute top-0 left-0 right-0 h-10 bg-white flex items-center overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-full flex-1"
                style={{
                  background: i % 2 === 0 ? "#ffffff" : "#000000",
                }}
              />
            ))}
          </div>
          <div className="absolute top-10 left-0 right-0 bottom-0 bg-[#1a1a1a] p-4">
            <div className="pixel-text text-white text-xs mb-2">AMR YOUSRY</div>
            <div className="pixel-text text-[#00ffcc] text-[10px] mb-1">SCENE 01</div>
            <div className="pixel-text text-white/50 text-[10px]">TAKE 01</div>
          </div>
          <div className="absolute top-10 left-0 right-0 h-2 flex">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-[#050508]/20"
                style={{
                  background: i % 2 === 0 ? "#ffffff" : "#000000",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-64 mb-4">
        <div className="flex justify-between mb-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-8 border-2 border-[#00ffcc]"
              style={{
                background: progress >= (i + 1) * 10 ? "#00ffcc" : "transparent",
                transition: "background 0.1s",
              }}
            />
          ))}
        </div>
        <div className="w-full h-2 bg-[#1a1a2e]">
          <div
            className="h-full bg-[#00ffcc] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="pixel-text text-[#00ffcc] text-xs tracking-widest mb-4">
        LOADING REEL...
      </div>

      <div className="pixel-text text-white text-xl mb-8">
        {Math.round(progress)}%
      </div>

      <div className="absolute bottom-12">
        <div className="pixel-text text-white/30 text-[10px]">
          CINEMA EDITION v1.0
        </div>
      </div>

      {isExiting && (
        <div className="absolute inset-0 bg-white animate-burn" />
      )}

      <style jsx global>{`
        @keyframes burn {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-burn {
          animation: burn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
