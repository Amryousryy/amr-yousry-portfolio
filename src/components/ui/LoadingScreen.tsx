"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface LoadingScreenProps {
  minDuration?: number;
}

export default function LoadingScreen({ minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const pathname = usePathname();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (hasShownRef.current) return;
    
    hasShownRef.current = true;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 500);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [minDuration, pathname]);

  if (pathname.startsWith("/admin")) return null;
  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050508] flex flex-col items-center justify-center">
      <div className="w-64 mb-8">
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
      
      <div className="pixel-text text-white text-xl">
        {Math.round(progress)}%
      </div>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#00ffcc]/5" />
        <div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent"
          style={{
            top: `${progress}%`,
            opacity: 0.5,
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes film-burn {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}