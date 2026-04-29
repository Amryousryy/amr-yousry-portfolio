"use client";

import { Play } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
      sectionRef.current.style.setProperty("--scroll-progress", scrolled.toFixed(2));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050508]"
    >
      {/* Background grid - subtle technical feel */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Cinematic frame edges */}
      <div className="absolute inset-4 md:inset-8 border border-[#00ffcc]/10 pointer-events-none" />
      <div className="absolute top-8 left-8 w-16 h-[1px] bg-[#00ffcc]/20" />
      <div className="absolute top-8 left-8 w-[1px] h-16 bg-[#00ffcc]/20" />
      <div className="absolute top-8 right-8 w-16 h-[1px] bg-[#00ffcc]/20" />
      <div className="absolute top-8 right-8 w-[1px] h-16 bg-[#00ffcc]/20" />
      <div className="absolute bottom-8 left-8 w-16 h-[1px] bg-[#00ffcc]/20" />
      <div className="absolute bottom-8 left-8 w-[1px] h-16 bg-[#00ffcc]/20" />
      <div className="absolute bottom-8 right-8 w-16 h-[1px] bg-[#00ffcc]/20" />
      <div className="absolute bottom-8 right-8 w-[1px] h-16 bg-[#00ffcc]/20" />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Badge - STR8FIRE inspired minimal tag */}
        <div className="mb-8 inline-block animate-fade-up">
          <div className="text-mono text-[#00ffcc] text-[10px] tracking-[0.4em] mb-2">
            AMR YOUSRY
          </div>
          <div className="w-16 h-[1px] bg-[#00ffcc]/30 mx-auto" />
        </div>

        {/* Main Headline - Conversion-focused */}
        <h1 className="text-hero font-black text-white mb-6 tracking-tighter animate-fade-up-delay-1">
          I Turn Video
          <br />
          <span className="text-[#00ffcc]">Into Leads</span>
          <br />
          For Ambitious Brands
        </h1>

        {/* Subheadline - Business outcome focused */}
        <p className="text-display text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up-delay-2">
          Strategic video content that generates leads and scales your brand to 6 figures.
        </p>

        {/* Trust signals - Moved up for immediate credibility */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-up-delay-2">
          {[
            { value: "50M+", label: "Views Generated" },
            { value: "3.5X", label: "Avg ROI" },
            { value: "100+", label: "Brands Scaled" },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-display font-black text-[#00ffcc]">{stat.value}</div>
              <div className="text-mono text-white/40 text-[9px]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs - Premium button treatment */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up-delay-3">
          <a
            href="#contact"
            className="group relative px-12 py-5 min-h-[64px] bg-[#00ffcc] text-[#050508] font-bold uppercase tracking-[0.2em] text-xs overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,245,212,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <a
            href="#projects"
            className="group flex items-center space-x-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-[#00ffcc] transition-all duration-300 px-6 py-5 min-h-[64px]"
          >
            <div className="w-14 h-14 bg-white/5 flex items-center justify-center border border-[#00ffcc]/20 group-hover:bg-[#00ffcc] group-hover:text-[#050508] group-hover:border-[#00ffcc] transition-all duration-300">
              <Play size={20} fill="currentColor" />
            </div>
            <span>View My Work</span>
          </a>
        </div>

        {/* Scroll indicator - STR8FIRE style */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up-delay-3">
          <span className="text-mono text-[#00ffcc]/50 text-[10px]">SCROLL</span>
          <div className="w-6 h-10 border-2 border-[#00ffcc]/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#00ffcc] rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Stats bar - Static, premium treatment */}
      <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0f]/80 backdrop-blur-xl py-8 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50M+", label: "Views Generated", context: "across campaigns" },
              { value: "100+", label: "Brands Scaled", context: "to 6 figures" },
              { value: "3.5X", label: "Avg ROI", context: "increase proven" },
              { value: "100%", label: "Data-Driven", context: "content strategy" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-display font-black text-[#00ffcc] mb-1">{stat.value}</div>
                <div className="text-mono text-white/40 text-[9px] mb-0.5">{stat.label}</div>
                <div className="text-mono text-white/20 text-[8px]">{stat.context}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
