"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "@/styles/pixel-system.css";

const FilmStudioIsland = dynamic(() => import("@/components/three/FilmStudioIsland"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#050508]" />,
});

const ROLES = ["Video Editor", "Motion Designer", "Content Strategist", "Visual Storyteller"];

const STATS = [
  { icon: "★", value: 20, suffix: "+", label: "BRANDS" },
  { icon: "◆", value: 3, suffix: "+", label: "YEARS" },
  { icon: "▶", value: 1, suffix: "M+", label: "VIEWS" },
];

export default function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [displayedStats, setDisplayedStats] = useState({ 0: 0, 1: 0, 2: 0 });
  const [showUrgency, setShowUrgency] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowSocialProof(true), 1500);
    setTimeout(() => setShowUrgency(true), 2500);

    STATS.forEach((stat, index) => {
      let current = 0;
      const increment = stat.value / 25;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setDisplayedStats((prev) => ({ ...prev, [index]: stat.value }));
          clearInterval(interval);
        } else {
          setDisplayedStats((prev) => ({ ...prev, [index]: Math.floor(current) }));
        }
      }, 40);
    });
  }, []);

  useEffect(() => {
    const fullText = ROLES[currentRole];
    let charIndex = 0;
    setDisplayedText("");

    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentRole((prev) => (prev + 1) % ROLES.length);
        }, 2000);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [currentRole]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      <FilmStudioIsland />

      <div className="relative z-10 max-w-5xl w-full">
        <div className="pixel-badge mb-8 animate-pulse" aria-label="Available for new projects">
          <span className="relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping" aria-hidden="true" />
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" aria-hidden="true" />
            AVAILABLE FOR PROJECTS
          </span>
        </div>

        <h1 className="font-sora text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight max-w-3xl animate-fade-up">
          I Turn Ideas Into Films That Make People Act
        </h1>

        <div className="animate-fade-up-delay-1">
          <div className="flex items-center gap-4 mb-6" role="list" aria-label="Skills">
            {ROLES.map((role, i) => (
              <span
                key={role}
                role="listitem"
                className={`pixel-text text-sm ${i === currentRole ? "text-[#00ffcc]" : "text-white/40"}`}
              >
                {role}
                {i < ROLES.length - 1 && <span className="text-white/20 mx-2" aria-hidden="true">·</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-8" aria-live="polite" aria-label="Current role">
            <span className="text-white/40 text-lg" aria-hidden="true">"</span>
            <span className="text-white text-lg md:text-xl font-sora">{displayedText}</span>
            <span className="typewriter text-[#00ffcc]" aria-hidden="true">|</span>
            <span className="text-white/40 text-lg" aria-hidden="true">"</span>
          </div>
        </div>

        <div className={`mb-6 animate-fade-up-delay-2 transition-opacity duration-500 ${showSocialProof ? "opacity-100" : "opacity-0"}`}>
          <div className="pixel-text text-[#00ffcc] text-xs" aria-label="Social proof">
            ★ Trusted by 20+ brands across Egypt & Saudi Arabia
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 animate-fade-up-delay-2" role="list" aria-label="Key statistics">
          {STATS.map((stat, i) => {
            const index = i as keyof typeof displayedStats;
            return (
              <div key={i} className="pixel-stat" role="listitem">
                <span className="text-[#00ffcc] mr-1" aria-hidden="true">{stat.icon}</span>
                <span className="text-white font-bold">
                  {displayedStats[index]}{stat.suffix}
                </span>
                <span className="text-[#00ffcc] ml-1">{stat.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 mb-8 animate-fade-up-delay-3">
          <a href="#projects" className="pixel-btn flex items-center gap-2" aria-label="Watch portfolio">
            <span aria-hidden="true">▶</span>
            <span>WATCH MY WORK</span>
          </a>

          <a href="#contact" className="pixel-btn-outline flex items-center gap-2" aria-label="Contact Amr Yousry">
            <span aria-hidden="true">✉</span>
            <span>LET&apos;S TALK</span>
          </a>
        </div>

        <div className={`pixel-text text-white/50 text-xs transition-opacity duration-500 ${showUrgency ? "opacity-100" : "opacity-0"}`} aria-label="Current availability">
          ⏳ Currently taking 2 new projects for May 2026
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-label="Scroll down">
        <span className="pixel-text text-[#00ffcc]/50 text-xs">SCROLL</span>
        <div className="w-6 h-10 border-2 border-[#00ffcc]/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#00ffcc] rounded-full animate-bounce" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}