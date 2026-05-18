"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

const characters = [
  { src: "/images/about/characters/character-01-v3.png", alt: "Amr Yousry pixel character with camera" },
  { src: "/images/about/characters/character-02-v3.png", alt: "Amr Yousry pixel character alternate outfit" },
  { src: "/images/about/characters/character-03-v3.png", alt: "Amr Yousry pixel character creative designer setup" },
  { src: "/images/about/characters/character-04-v3.png", alt: "Amr Yousry pixel character sports outfit" },
  { src: "/images/about/characters/character-05-v3.png", alt: "Amr Yousry pixel character additional profile outfit" },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir * 120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const },
      opacity: { duration: 0.15, ease: "linear" as const },
    },
  },
  exit: (dir: number) => ({
    x: dir * -120,
    opacity: 0,
    transition: {
      x: { duration: 0.12, ease: [0.23, 1, 0.32, 1] as const },
      opacity: { duration: 0.1, ease: "linear" as const },
    },
  }),
};

const reducedVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

export default function CharacterSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const total = characters.length;
  const showArrows = total > 1;

  useEffect(() => {
    characters.forEach(({ src }) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const handleTransition = useCallback((newDirection: 'next' | 'prev') => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const dir = newDirection === 'next' ? 1 : -1;
    setDirection(dir);
    setCurrentIndex((prev) => {
      return newDirection === 'next' ? (prev + 1) % total : (prev - 1 + total) % total;
    });

    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 250);
  }, [total]);

  const variants = shouldReduceMotion ? reducedVariants : slideVariants;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="relative flex-1 w-full min-h-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={characters[currentIndex].src}
                alt={characters[currentIndex].alt}
                fill
                className="object-contain image-pixel"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {showArrows && (
          <button
            onClick={() => handleTransition('prev')}
            disabled={isTransitioning}
            aria-label="Previous character"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan w-11 h-11 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
        )}

        {showArrows && (
          <button
            onClick={() => handleTransition('next')}
            disabled={isTransitioning}
            aria-label="Next character"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 font-pixel text-brand-cyan text-xl bg-slate-900/50 border border-slate-700 hover:border-brand-cyan w-11 h-11 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        )}
      </div>

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
