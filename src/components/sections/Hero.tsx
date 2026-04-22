"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { data: hero } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: () => SettingsService.getHero(),
  });

  const settings = hero?.data;

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
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        
        {settings.showreelVideo ? (
          <video
            ref={videoRef}
            src={settings.showreelVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
            poster={settings.posterImage}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url(${settings.posterImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 pointer-events-none" />
      </div>

      {/* Mute/Unmute Toggle for Background */}
      {settings.showreelVideo && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-24 right-10 z-40 p-3 bg-white/5 border border-white/10 text-white/40 hover:text-accent hover:border-accent transition-all"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      <div className="container mx-auto px-6 relative z-30 text-center">
        <div className="mb-6 inline-block">
          <span className="pixel-text text-accent text-[10px] tracking-[0.4em] bg-accent/10 px-6 py-2 pixel-border uppercase">
            Creative Strategist & Video Editor
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-4xl md:text-8xl font-display font-bold leading-none mb-8 tracking-tighter uppercase"
        >
          {settings.headline?.en?.split(' ').map((word: string, i: number) => (
            <span key={i} className={i === 1 || i === 3 ? "text-accent italic font-serif lowercase tracking-normal" : ""}>
              {word}{" "}
            </span>
          ))}
        </h1>

        <p
          ref={subTitleRef}
          className="text-sm md:text-xl text-foreground/50 max-w-2xl mx-auto mb-12 font-sans uppercase tracking-[0.2em] font-medium"
        >
          {settings.subheadline?.en}
        </p>

        <div ref={ctaRef} className="flex flex-col md:flex-row items-center justify-center gap-8">
          <a href={settings.primaryCTALink} className="group relative px-12 py-5 bg-accent text-background font-bold uppercase tracking-[0.3em] text-[10px] overflow-hidden pixel-border transition-transform hover:scale-105 active:scale-95">
            <span className="relative z-10">{settings.primaryCTA?.en}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-accent transition-colors"
          >
            <div className="w-14 h-14 bg-white/5 flex items-center justify-center pixel-border group-hover:bg-accent group-hover:text-background transition-all">       
              <Play size={20} fill="currentColor" />
            </div>
            <span>{settings.secondaryCTA?.en}</span>
          </button>
        </div>
      </div>

      {/* Modern Analytics Stripe */}
      <div className="absolute bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl py-6 z-40 border-t border-white/5 hidden md:block">
         <div className="container mx-auto px-6 flex justify-around items-center">
            {[
               { label: "Total Views Generated", value: "50M+" },
               { label: "Brands Scaled", value: "100+" },
               { label: "Avg. ROI Increase", value: "3.5X" },
               { label: "High-Ticket Content", value: "100% Proven" }
            ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center">
                  <span className="text-accent font-display font-bold text-3xl tracking-tighter leading-none mb-1">{stat.value}</span>
                  <span className="text-foreground/30 text-[9px] uppercase font-bold tracking-[0.2em]">{stat.label}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Showreel Modal */}
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
               {settings.showreelVideo ? (
                 <iframe 
                  src={`${settings.showreelVideo}${settings.showreelVideo.includes('?') ? '&' : '?'}autoplay=1`}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
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
                  <p className="text-white text-[10px] uppercase tracking-widest opacity-60">Creative Showreel 2024</p>
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
