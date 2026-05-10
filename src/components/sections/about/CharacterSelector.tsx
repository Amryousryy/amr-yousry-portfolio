"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const total = characters.length;
  const showArrows = total > 1;

  const handleTransition = useCallback((newDirection: 'next' | 'prev') => {
    setCurrentIndex((prev) => {
      return newDirection === 'next' ? (prev + 1) % total : (prev - 1 + total) % total;
    });
  }, [total]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Character Image Area */}
      <div className="relative flex-1 w-full min-h-0 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={characters[currentIndex].src}
              alt={characters[currentIndex].alt}
              fill
              className="object-contain image-pixel"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Left Arrow */}
        {showArrows && (
          <button
            onClick={() => handleTransition('prev')}
            aria-label="Previous character"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan w-11 h-11 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
        )}

        {/* Right Arrow */}
        {showArrows && (
          <button
            onClick={() => handleTransition('next')}
            aria-label="Next character"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan w-11 h-11 flex items-center justify-center transition-colors"
          >
            ›
          </button>
        )}
      </div>

      {/* Character Indicator */}
      {showArrows && (
        <div className="shrink-0 flex items-center justify-center pt-2 pb-1.5">
          <span className="font-pixel text-[10px] text-brand-cyan/70 tracking-wider leading-none">
            CHARACTER {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
