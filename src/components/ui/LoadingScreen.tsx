"use client";

import { useEffect, useState } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050508] flex flex-col items-center justify-center text-teal-400">
      <div className="mb-8">
        {/* Pixel Clapperboard SVG */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4h-2l2 4h-3l-2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V4h-5z" />
        </svg>
      </div>
      
      <div className="text-[10px] font-mono mb-4 animate-pulse" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        LOADING REEL... {Math.round(progress)}%
      </div>
      
      <div className="w-64 h-2 bg-teal-900/30 border border-teal-500/30 overflow-hidden relative">
        <div 
          className="h-full bg-teal-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {/* Film Strip Effect */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1 h-full bg-[#050508]/20" />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-[8px] opacity-50 uppercase tracking-widest font-mono">
        [ Frame: {Math.floor(progress * 2.4)} / 240 ]
      </div>
    </div>
  );
};

export default LoadingScreen;
