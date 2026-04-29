"use client";

import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-background">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6 inline-block">
          <span className="pixel-text text-accent text-[10px] tracking-[0.4em] bg-accent/10 px-6 py-2 pixel-border uppercase">
            High-Ticket Video Content
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 tracking-tight">
          I Turn Content Into Clients
        </h1>

        <p className="text-base md:text-xl text-foreground/60 max-w-xl mx-auto mb-12">
          Strategic video content that generates leads and scales brands for ambitious companies.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a
            href="#contact"
            className="group relative px-10 py-4 min-h-[56px] bg-accent text-background font-bold uppercase tracking-[0.2em] text-xs overflow-hidden pixel-border transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,245,212,0.3)] hover:shadow-[0_0_50px_rgba(0,245,212,0.5)] flex items-center justify-center"
          >
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <a
            href="#projects"
            className="group flex items-center space-x-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 hover:text-accent transition-colors duration-300 px-4 py-3 min-h-[56px]"
          >
            <div className="w-12 h-12 min-w-[48px] bg-white/5 flex items-center justify-center pixel-border group-hover:bg-accent group-hover:text-background transition-all duration-300">
              <Play size={18} fill="currentColor" />
            </div>
            <span>View My Work</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl py-6 border-t border-white/5">
        <div className="container mx-auto px-6 flex justify-around items-center">
          {[
            { label: "Views Generated", value: "50M+", context: "across campaigns" },
            { label: "Brands Scaled", value: "100+", context: "to 6 figures" },
            { label: "Avg ROI", value: "3.5X", context: "increase proven" },
            { label: "Content Strategy", value: "100%", context: "data-driven" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-accent font-display font-bold text-3xl tracking-tighter leading-none mb-1">{stat.value}</span>
              <span className="text-foreground/40 text-[9px] uppercase font-bold tracking-[0.15em]">{stat.label}</span>
              <span className="text-foreground/30 text-[8px] uppercase tracking-wider mt-0.5">{stat.context}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
