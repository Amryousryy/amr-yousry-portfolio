"use client";

import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";
import dynamic from "next/dynamic";

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
  const [mounted, setMounted] = useState(false);
  const [showUrgency, setShowUrgency] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nameSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 40,
    config: { tension: 80, friction: 20 },
    delay: 400,
  });

  const subtitleSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 30,
    config: { tension: 80, friction: 20 },
    delay: 600,
  });

  const statsSpring = useSpring({
    opacity: mounted ? 1 : 0,
    config: { tension: 80, friction: 20 },
    delay: 800,
  });

  const ctaSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 20,
    config: { tension: 80, friction: 20 },
    delay: 1200,
  });

  const urgencySpring = useSpring({
    opacity: showUrgency ? 1 : 0,
    y: showUrgency ? 0 : 20,
    config: { tension: 80, friction: 20 },
  });

  const socialProofSpring = useSpring({
    opacity: showSocialProof ? 1 : 0,
    y: showSocialProof ? 0 : 10,
    config: { tension: 80, friction: 20 },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

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
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

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
  }, [currentRole, mounted]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      <FilmStudioIsland />

      <div className="relative z-10 max-w-5xl w-full">
        <div className="pixel-badge mb-8 animate-pulse">
          <span className="relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
            AVAILABLE FOR PROJECTS
          </span>
        </div>

        <animated.h1
          style={nameSpring}
          className="font-sora text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight max-w-3xl"
        >
          I Turn Ideas Into Films That Make People Act
        </animated.h1>

        <animated.div style={subtitleSpring}>
          <div className="flex items-center gap-4 mb-6">
            {ROLES.map((role, i) => (
              <span
                key={role}
                className={`pixel-text text-sm ${
                  i === currentRole ? "text-[#00ffcc]" : "text-white/40"
                } transition-colors`}
              >
                {role}
                {i < ROLES.length - 1 && <span className="text-white/20 mx-2">·</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-8">
            <span className="text-white/40 text-lg">"</span>
            <span className="text-white text-lg md:text-xl font-sora">{displayedText}</span>
            <span className="typewriter text-[#00ffcc]">|</span>
            <span className="text-white/40 text-lg">"</span>
          </div>
        </animated.div>

        <animated.div
          style={socialProofSpring}
          className="mb-6"
        >
          <div className="pixel-text text-[#00ffcc] text-xs">
            ★ Trusted by 20+ brands across Egypt & Saudi Arabia
          </div>
        </animated.div>

        <animated.div
          style={statsSpring}
          className="flex flex-wrap gap-3 mb-8"
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
        </animated.div>

        <animated.div
          style={ctaSpring}
          className="flex flex-wrap gap-4 mb-8"
        >
          <a href="#projects" className="pixel-btn flex items-center gap-2">
            <span>▶</span>
            <span>WATCH MY WORK</span>
          </a>

          <a href="#contact" className="pixel-btn-outline flex items-center gap-2">
            <span>✉</span>
            <span>LET&apos;S TALK</span>
          </a>
        </animated.div>

        <animated.div
          style={urgencySpring}
          className="pixel-text text-white/50 text-xs"
        >
          ⏳ Currently taking 2 new projects for May 2026
        </animated.div>
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