"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const TOTAL_FRAMES = 24;

export default function PremiumLoadingScreen() {
  const [frame, setFrame] = useState(0);
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
      setFrame(Math.min(Math.floor((elapsed / totalDuration) * TOTAL_FRAMES), TOTAL_FRAMES));

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
      {/* Film Reel Loading Experience */}
      <div className="relative w-80 md:w-96 aspect-video max-h-[60vh] frame-border">
        {/* Frame counter - top left */}
        <div className="absolute -top-8 -left-8 frame-number">
          FRAME {String(frame).padStart(2, '0')}
        </div>

        {/* Reel indicator - top right */}
        <div className="absolute -top-8 -right-8 frame-label">
          LOADING REEL
        </div>

        {/* Main content area */}
        <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center">
          {/* Name reveal */}
          <div className="mb-4 transition-opacity duration-500" style={{ opacity: frame >= 6 ? 1 : 0 }}>
            <div className="text-mono text-[#00ffcc] text-[10px] tracking-[0.4em] mb-2">
              AMR YOUSRY
            </div>
            <div className="w-16 h-[1px] bg-[#00ffcc]/30 mx-auto" />
          </div>

          {/* Title */}
          <div className="text-center transition-opacity duration-500" style={{ opacity: frame >= 12 ? 1 : 0 }}>
            <div className="text-hero font-black text-white leading-none mb-2">
              FRAME
              <br />
              <span className="text-[#00ffcc]">LOGIC</span>
            </div>
          </div>

          {/* Frame strip indicator */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex justify-between mb-2">
              {[...Array(TOTAL_FRAMES)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-4 transition-colors duration-100 ${
                    i <= frame ? "bg-[#00ffcc]" : "bg-[#00ffcc]/20"
                  }`}
                />
              ))}
            </div>
            <div className="w-full h-1 bg-[#1a1a2e]">
              <div
                className="h-full bg-[#00ffcc] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="frame-number">TC: {String(frame).padStart(2, '0')}</span>
              <span className="frame-number">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Perforation marks */}
        <div className="absolute top-0 left-0 w-4 h-full -translate-x-full flex flex-col justify-around py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-2 border border-[#00ffcc]/30 rounded-sm" />
          ))}
        </div>
        <div className="absolute top-0 right-0 w-4 h-full translate-x-full flex flex-col justify-around py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-2 border border-[#00ffcc]/30 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Exit shutter transition */}
      {isExiting && (
        <div className="absolute inset-0 bg-white shutter-transition pointer-events-none" />
      )}
    </div>
  );
}
