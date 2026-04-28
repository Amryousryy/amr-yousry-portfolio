"use client";

import { useEffect, useState, useRef } from "react";
import { animate, createTimeline } from "animejs";
import { usePathname } from "next/navigation";

const ROLES = ["Video Editor", "Motion Designer", "Content Strategist", "Visual Storyteller"];

const STATS = [
  { icon: "★", value: 50, suffix: "+", label: "FILMS" },
  { icon: "◆", value: 3, suffix: "+", label: "YEARS" },
  { icon: "▶", value: 1, suffix: "M+", label: "VIEWS" },
];

export default function HeroText() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [displayedStats, setDisplayedStats] = useState({ 0: 0, 1: 0, 2: 0 });
  const [mounted, setMounted] = useState(false);

  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const typewriterAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const statAnimRefs = useRef<(ReturnType<typeof animate> | null)[]>([]);

  // Mount animation — single timeline replaces both react-spring AND GSAP
  useEffect(() => {
    setMounted(true);

    timelineRef.current = createTimeline({
      autoplay: true,
      defaults: { ease: "outQuint" },
    });

    if (nameRef.current) {
      timelineRef.current.add(nameRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
      }, 300);
    }

    if (subtitleRef.current) {
      timelineRef.current.add(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
      }, 600);
    }

    if (statsRef.current) {
      timelineRef.current.add(statsRef.current, {
        opacity: [0, 1],
      }, 900);
    }

    if (buttonsRef.current) {
      timelineRef.current.add(buttonsRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
      }, 1200);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.cancel();
      }
    };
  }, []);

  // Typewriter animation — replaces setInterval
  useEffect(() => {
    const fullText = ROLES[currentRole];
    const progress = { charIndex: 0 };

    typewriterAnimRef.current = animate(progress, {
      charIndex: fullText.length,
      duration: fullText.length * 70,
      ease: "linear",
      autoplay: true,
      onUpdate: () => {
        setDisplayedText(fullText.slice(0, Math.floor(progress.charIndex)));
      },
      onComplete: () => {
        setTimeout(() => {
          setCurrentRole((prev) => (prev + 1) % ROLES.length);
        }, 2500);
      },
    });

    return () => {
      if (typewriterAnimRef.current) {
        typewriterAnimRef.current.cancel();
      }
    };
  }, [currentRole]);

  // Stat counter animations — replaces setInterval
  useEffect(() => {
    STATS.forEach((stat, index) => {
      const progress = { value: 0 };

      statAnimRefs.current[index] = animate(progress, {
        value: stat.value,
        duration: 1500,
        ease: "outExpo",
        autoplay: true,
        onUpdate: () => {
          setDisplayedStats((prev) => ({ ...prev, [index]: Math.floor(progress.value) }));
        },
        onComplete: () => {
          setDisplayedStats((prev) => ({ ...prev, [index]: stat.value }));
        },
      });
    });

    return () => {
      statAnimRefs.current.forEach((anim) => {
        if (anim) anim.cancel();
      });
      statAnimRefs.current = [];
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-5xl w-full">
        <div className="pixel-badge mb-8">
          <span className="relative">AVAILABLE FOR PROJECTS</span>
        </div>

        <h1
          ref={nameRef}
          className="font-sora text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight"
        >
          AMR YOUSRY
        </h1>

        <div ref={subtitleRef}>
          <div className="h-1 w-32 bg-gradient-to-r from-[#00ffcc] to-transparent mb-6" />

          <div className="pixel-text text-[#00ffcc] text-sm md:text-base mb-4">
            <span data-text="VISUAL STORYTELLER" className="glitch-text">
              VISUAL STORYTELLER
            </span>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <span className="text-white text-lg md:text-xl font-light">
              &quot;
            </span>
            <span className="text-white text-lg md:text-xl font-sora">
              {displayedText}
            </span>
            <span className="typewriter text-[#00ffcc]">|</span>
            <span className="text-white text-lg md:text-xl font-light">
              &quot;
            </span>
          </div>
        </div>

        <div
          ref={statsRef}
          className="flex flex-wrap gap-4 mb-10"
        >
          {STATS.map((stat, i) => {
            const index = i as keyof typeof displayedStats;
            return (
              <div key={i} className="pixel-stat">
                <span className="text-[#00ffcc] mr-1">{stat.icon}</span>
                <span className="text-white font-bold">
                  {displayedStats[index]}{stat.suffix}
                </span>
                <span className="text-[#00ffcc] ml-1">{stat.label}</span>
              </div>
            );
          })}
        </div>

        <div
          ref={buttonsRef}
          className="flex flex-wrap gap-4"
        >
          <button className="pixel-btn flex items-center gap-2">
            <span>▶</span>
            <span>WATCH SHOWREEL</span>
          </button>

          <button className="pixel-btn-outline flex items-center gap-2">
            <span>→</span>
            <span>GET IN TOUCH</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="pixel-text text-[#00ffcc]/50 text-xs">SCROLL</span>
        <div className="w-6 h-10 border-2 border-[#00ffcc]/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#00ffcc] rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
