"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroText = () => {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(nameRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    tl.fromTo(subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.5"
    );

    tl.fromTo(statsRef.current?.children || [],
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, stagger: 0.2, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-white">
      <div className="container mx-auto px-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400">
            Available for Projects
          </span>
        </div>

        <h1 
          ref={nameRef}
          className="text-6xl md:text-8xl font-bold mb-2 tracking-tighter"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          AMR YOUSRY
        </h1>

        <div className="h-1 w-32 bg-teal-500 mb-6" />

        <h2 
          ref={subtitleRef}
          className="glitch-text text-xl md:text-2xl text-teal-400 mb-12 uppercase tracking-[0.2em]"
          data-text="VISUAL STORYTELLER"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          VISUAL STORYTELLER
        </h2>

        <div ref={statsRef} className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
          <div className="pixel-stat">
            <span className="text-teal-400">★</span>
            <span>50+ FILMS</span>
          </div>
          <div className="pixel-stat">
            <span className="text-teal-400">◆</span>
            <span>3+ YEARS</span>
          </div>
          <div className="pixel-stat">
            <span className="text-teal-400">▶</span>
            <span>1M+ VIEWS</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto justify-center md:justify-start">
          <button className="pixel-btn">
            ▶ Watch Showreel
          </button>
          <button className="pixel-btn outline">
            → Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
