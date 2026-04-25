"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { isAllowedVideoUrl } from "@/lib/video-validator";

const PremiumHeroScene = dynamic(
  () => import("@/components/three/PremiumHeroScene"),
  {
    ssr: false,
    loading: () => null,
  }
);

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: hero } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: () => SettingsService.getHero(),
  });

  const settings = hero?.data;
  const headline = getString(settings?.headline);
  const subheadline = getString(settings?.subheadline);
  const primaryCTA = getString(settings?.primaryCTA);
  const secondaryCTA = getString(settings?.secondaryCTA);

  useGSAP(() => {
    if (!settings) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.5 }
    )
      .fromTo(
        subTitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        ctaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        "-=0.5"
      );
  }, { scope: container, dependencies: [settings] });

  if (!settings) return null;

  return (
    <section
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        <PremiumHeroScene className="opacity-80" />
      </div>
        
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-30 text-center">
        <div className="mb-6 inline-block">
          <span className="pixel-text text-accent text-[10px] tracking-[0.4em] bg-accent/10 px-6 py-2 pixel-border uppercase">
            High-Ticket Video Content
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-4xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 tracking-tight"
        >
          {headline || "I Turn Content Into Clients"}
        </h1>

        <p
          ref={subTitleRef}
          className="text-base md:text-xl text-foreground/60 max-w-xl mx-auto mb-12 font-sans"
        >
          {subheadline || "Strategic video content that generates leads and scales brands for ambitious companies."}
        </p>

        <div ref={ctaRef} className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a href={settings?.primaryCTALink || "#contact"} className="group relative px-10 py-4 bg-accent text-background font-bold uppercase tracking-[0.2em] text-xs overflow-hidden pixel-border transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,245,212,0.3)] hover:shadow-[0_0_50px_rgba(0,245,212,0.5)]">
            <span className="relative z-10">{primaryCTA || "Start Your Project"}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center space-x-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 hover:text-accent transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-white/5 flex items-center justify-center pixel-border group-hover:bg-accent group-hover:text-background transition-all duration-300">       
              <Play size={18} fill="currentColor" />
            </div>
            <span>{secondaryCTA || "View My Work"}</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl py-6 z-40 border-t border-white/5 hidden md:block">
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

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl"
          >
            <motion.button
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-white/40 hover:text-accent transition-colors"
            >
              <X size={40} strokeWidth={1} />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-6xl aspect-video bg-black pixel-border relative overflow-hidden group shadow-[0_0_100px_rgba(0,245,212,0.1)]"
            >
{isAllowedVideoUrl(settings.showreelVideo) ? (
                  <iframe 
                    src={`${settings.showreelVideo}${settings.showreelVideo.includes('?') ? '&' : '?'}autoplay=1`}
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onError={() => {
                      console.warn("Iframe failed to load video");
                    }}
                  />
                ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                   <div className="w-20 h-20 border-2 border-accent border-dashed rounded-full animate-spin-slow flex items-center justify-center">
                      <Play size={32} className="text-accent ml-1" />
                   </div>
                   <p className="pixel-text text-accent text-xl tracking-widest uppercase">Coming Soon</p>
                 </div>
               )}

               <div className="absolute bottom-8 left-8 p-4 bg-background/80 backdrop-blur-md border-l-4 border-accent hidden md:block">
<p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Amr Yousry</p>
                   <p className="text-white text-[10px] uppercase tracking-widest opacity-60">Creative Showreel 2026</p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent relative">
           <motion.div 
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_#00F5D4]" 
           />
        </div>
      </div>
    </section>
  );
}