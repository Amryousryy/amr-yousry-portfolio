"use client";

import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";

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

  const nameSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 30,
    config: { tension: 80, friction: 20 },
    delay: 300,
  });

  const subtitleSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 20,
    config: { tension: 80, friction: 20 },
    delay: 600,
  });

  const statsSpring = useSpring({
    opacity: mounted ? 1 : 0,
    config: { tension: 80, friction: 20 },
    delay: 900,
  });

  const buttonsSpring = useSpring({
    opacity: mounted ? 1 : 0,
    y: mounted ? 0 : 20,
    config: { tension: 80, friction: 20 },
    delay: 1200,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    gsap.from(nameRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
    });
    
    gsap.from(subtitleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.6,
      ease: "power3.out",
    });
    
    gsap.from(buttonsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 1.2,
      ease: "power3.out",
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
        }, 2500);
      }
    }, 70);
    
    return () => clearInterval(typeInterval);
  }, [currentRole, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    STATS.forEach((stat, index) => {
      let current = 0;
      const increment = stat.value / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setDisplayedStats((prev) => ({ ...prev, [index]: stat.value }));
          clearInterval(interval);
        } else {
          setDisplayedStats((prev) => ({ ...prev, [index]: Math.floor(current) }));
        }
      }, 50);
    });
  }, [mounted]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-5xl w-full">
        <div className="pixel-badge mb-8">
          <span className="relative">AVAILABLE FOR PROJECTS</span>
        </div>
        
        <animated.h1
          ref={nameRef}
          style={nameSpring}
          className="font-sora text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight"
        >
          AMR YOUSRY
        </animated.h1>
        
        <animated.div ref={subtitleRef} style={subtitleSpring}>
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
        </animated.div>
        
        <animated.div
          style={statsSpring}
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
        </animated.div>
        
        <animated.div
          ref={buttonsRef}
          style={buttonsSpring}
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