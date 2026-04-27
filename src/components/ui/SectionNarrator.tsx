"use client";

import { useEffect, useState, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface Chapter {
  number: string;
  title: string;
  emotion: string;
}

const CHAPTERS: Chapter[] = [
  { number: "01", title: "WHO AM I", emotion: "curiosity + power" },
  { number: "02", title: "THE WORK", emotion: "proof + desire" },
  { number: "03", title: "HOW I WORK", emotion: "clarity + trust" },
  { number: "04", title: "THE RESULTS", emotion: "confidence" },
  { number: "05", title: "LET'S CREATE", emotion: "excitement + urgency" },
];

interface SectionNarratorProps {
  sections: string[];
}

export default function SectionNarrator({ sections }: SectionNarratorProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
  
          sectionRefs.current.forEach((section, index) => {
            if (!section) return;
  
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
  
            if (scrollY >= sectionTop - windowHeight * 0.5 && scrollY < sectionTop + sectionHeight - windowHeight * 0.3) {
              setCurrentChapter(index);
  
              const progressInSection = Math.max(0, Math.min(1,
                (scrollY - sectionTop + windowHeight * 0.5) / (sectionHeight - windowHeight * 0.5)
              ));
              setSectionProgress(progressInSection);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const chapter = CHAPTERS[Math.min(currentChapter, CHAPTERS.length - 1)];

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-8 left-8 z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pixel-box bg-[#0a0a0f]/90 backdrop-blur-sm p-4">
        <div className="pixel-text text-[#00ffcc] text-xs mb-1">
          CHAPTER {chapter.number} / 05
        </div>
        <div className="pixel-text text-white text-xs mb-2">{chapter.title}</div>
        <div className="w-32 h-1 bg-[#1a1a2e]">
          <motion.div
            className="h-full bg-[#00ffcc]"
            initial={{ width: "0%" }}
            animate={{ width: `${sectionProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="pixel-text text-[#00ffcc]/50 text-[10px] mt-1">
          {Math.round(sectionProgress * 100)}%
        </div>
      </div>
    </div>
  );
}

export function registerSectionRef(index: number, ref: HTMLElement | null) {
  (SectionNarrator as any).sectionRefs = (SectionNarrator as any).sectionRefs || [];
  (SectionNarrator as any).sectionRefs[index] = ref;
}