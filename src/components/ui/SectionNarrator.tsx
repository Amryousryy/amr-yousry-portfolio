"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

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

export default function SectionNarrator({ sections }: { sections: string[] }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const lastUpdateChapter = useRef(-1);
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Root margin creates a "center-focused" detection area
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: Array.from({ length: 10 }, (_, i) => i / 10),
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.getAttribute('data-section');
          const index = sections.indexOf(sectionId || "");
          
          if (index !== -1) {
            // Only update chapter state if it actually changed
            if (lastUpdateChapter.current !== index) {
              lastUpdateChapter.current = index;
              setCurrentChapter(index);
            }
            setSectionProgress(entry.intersectionRatio);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
      if (el) observer.observe(el);
    });

    const timer = setTimeout(() => setIsVisible(true), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [sections]);

  const chapter = CHAPTERS[Math.min(currentChapter, CHAPTERS.length - 1)];

  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } hidden md:block`}
    >
      <div className="pixel-box bg-[#0a0a0f]/90 backdrop-blur-md p-4 border border-white/5">
        <div className="pixel-text text-[#00ffcc] text-[10px] mb-1 tracking-widest">
          CHAPTER {chapter.number} / 05
        </div>
        <div className="pixel-text text-white text-xs mb-3 font-bold">{chapter.title}</div>
        <div className="w-32 h-1 bg-white/5 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#00ffcc] will-change-transform"
            initial={{ width: "0%" }}
            animate={{ width: `${sectionProgress * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="pixel-text text-[#00ffcc]/50 text-[9px] uppercase tracking-tighter">
            {chapter.emotion}
          </div>
          <div className="pixel-text text-white/40 text-[9px]">
            {Math.round(sectionProgress * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
