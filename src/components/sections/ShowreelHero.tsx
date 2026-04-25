"use client";

import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Volume2, VolumeX, ArrowRight } from "lucide-react";

export default function ShowreelHero() {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [trackingBenchmarks, setTrackingBenchmarks] = useState({ p25: false, p50: false, p75: false, p100: false });

  const { data: showreels } = useQuery({
    queryKey: ["active-showreel"],
    queryFn: async () => {
      const res = await fetch("/api/showreels");
      return res.json();
    },
  });

  const activeShowreel = showreels?.[0];

  const logInteraction = async (type: string, metadata?: any) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interaction",
          page: "/",
          interactionType: type,
          metadata: { ...metadata, showreelId: activeShowreel?._id }
        })
      });
    } catch (e) {
      console.error("Analytics log failed");
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = video.currentTime / video.duration;
      if (progress >= 0.25 && !trackingBenchmarks.p25) {
        logInteraction("showreel_25_percent");
        setTrackingBenchmarks(prev => ({ ...prev, p25: true }));
      }
      if (progress >= 0.5 && !trackingBenchmarks.p50) {
        logInteraction("showreel_50_percent");
        setTrackingBenchmarks(prev => ({ ...prev, p50: true }));
      }
      if (progress >= 0.75 && !trackingBenchmarks.p75) {
        logInteraction("showreel_75_percent");
        setTrackingBenchmarks(prev => ({ ...prev, p75: true }));
      }
      if (progress >= 0.99 && !trackingBenchmarks.p100) {
        logInteraction("showreel_complete");
        setTrackingBenchmarks(prev => ({ ...prev, p100: true }));
      }
    };

    const handlePlay = () => logInteraction("showreel_play");

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
    };
  }, [activeShowreel, trackingBenchmarks]);

  useGSAP(() => {
    if (!activeShowreel) return;
    
    const tl = gsap.timeline();
    tl.from(".hero-content > *", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
      delay: 0.5
    });
  }, { scope: container, dependencies: [activeShowreel] });

  if (!activeShowreel) return null;

  return (
    <section 
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 z-10" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 0.4 : 0 }}
          transition={{ duration: 2 }}
          className="w-full h-full"
        >
          <video
            ref={videoRef}
            src={activeShowreel.videoUrl}
            poster={activeShowreel.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover scale-105"
          />
        </motion.div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-[5]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[5]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 text-center hero-content">
        <motion.div 
          className="mb-8 inline-block"
          whileHover={{ scale: 1.05 }}
        >
          <span className="pixel-text text-accent text-[10px] tracking-[0.5em] bg-accent/10 px-8 py-3 pixel-border uppercase">
            Featured Showreel
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-9xl font-display font-bold leading-none mb-6 tracking-tighter uppercase">
          {activeShowreel.title}
        </h1>

        <p className="text-lg md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-12 font-sans uppercase tracking-[0.3em] font-medium leading-relaxed">
          {activeShowreel.subtitle}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <motion.a 
            href={activeShowreel.ctaLink}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-6 px-12 py-6 bg-accent text-background font-bold uppercase tracking-[0.4em] text-xs pixel-border"
          >
            <span>{activeShowreel.ctaText}</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </motion.a>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="group flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-accent transition-colors"
          >
            <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center pixel-border group-hover:border-accent transition-all">
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </div>
            <span>{isMuted ? "Unmute Audio" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="pixel-text text-[8px] text-foreground/20 uppercase tracking-[0.4em]">Explore Portfolio</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent relative overflow-hidden">
           <motion.div 
            animate={{ y: [-80, 80] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-accent shadow-[0_0_15px_#00F5D4]"
           />
        </div>
      </div>
    </section>
  );
}
