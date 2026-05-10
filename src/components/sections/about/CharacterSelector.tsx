"use client";

import { useState } from "react";
import Image from "next/image";

const characters = [
  {
    src: "/images/about/characters/character-01-v3.png",
    alt: "Amr Yousry pixel character with camera"
  },
  {
    src: "/images/about/characters/character-02-v3.png",
    alt: "Amr Yousry pixel character alternate outfit"
  },
  {
    src: "/images/about/characters/character-03-v3.png",
    alt: "Amr Yousry pixel character creative designer setup"
  },
  {
    src: "/images/about/characters/character-04-v3.png",
    alt: "Amr Yousry pixel character sports outfit"
  },
  {
    src: "/images/about/characters/character-05-v3.png",
    alt: "Amr Yousry pixel character additional profile outfit"
  }
];

export default function CharacterSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const total = characters.length;
  const showArrows = total > 1;

  const handleTransition = (newDirection: 'next' | 'prev') => {
    if (phase !== 'idle') return;
    
    setDirection(newDirection);
    setPhase('exit');

    // 1. Wait for exit animation
    setTimeout(() => {
      // 2. Switch character
      setCurrentIndex((prev) => {
        return newDirection === 'next' ? (prev + 1) % total : (prev - 1 + total) % total;
      });
      // 3. Trigger enter animation
      setPhase('enter');
      
      // 4. Wait for enter animation
      setTimeout(() => {
        setPhase('idle');
      }, 50); // Small delay to allow enter state to render
    }, 200); // Match CSS duration
  };

  const current = characters[currentIndex];

  // Animation Classes
  const baseClasses = "transition-all duration-200 ease-out motion-safe:transform";
  
  let animationClasses = "opacity-100 translate-x-0 scale-100";
  
  if (phase === 'exit') {
    animationClasses = direction === 'next' 
      ? "opacity-0 translate-x-4 sm:translate-x-8 scale-[0.98]"
      : "opacity-0 -translate-x-4 sm:-translate-x-8 scale-[0.98]";
  } else if (phase === 'enter') {
    animationClasses = direction === 'next' 
      ? "opacity-0 -translate-x-4 sm:-translate-x-8 scale-[0.98]"
      : "opacity-0 translate-x-4 sm:translate-x-8 scale-[0.98]";
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => handleTransition('prev')}
          disabled={phase !== 'idle'}
          aria-label="Previous character"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed w-11 h-11 flex items-center justify-center transition-colors"
        >
          ‹
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => handleTransition('next')}
          disabled={phase !== 'idle'}
          aria-label="Next character"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed w-11 h-11 flex items-center justify-center transition-colors"
        >
          ›
        </button>
      )}

      {/* Character Image */}
      <div className={`${baseClasses} ${animationClasses} relative w-full h-full`}>
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-contain image-pixel"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
          priority
        />
      </div>

      {/* Character Indicator */}
      {showArrows && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 font-pixel text-[10px] text-brand-cyan/70 tracking-wider">
          CHARACTER {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
