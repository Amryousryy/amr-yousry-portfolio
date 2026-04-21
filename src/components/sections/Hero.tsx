"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const ThreeBackground = dynamic(
  () => import("@/components/three/ThreeBackground"),
  { ssr: false, loading: () => <div /> }
);

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useGSAP(() => {
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
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 z-0">
        <ThreeBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-30 text-center">
        <div className="mb-6 inline-block">
          <span className="text-accent text-sm tracking-[0.3em] bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
            Creative Strategist
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-8xl font-display font-bold leading-tight mb-8 tracking-tighter"
        >
          I turn <span className="text-accent italic">content</span> into <br />
          <span className="relative inline-block group">
            clients
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent group-hover:bg-accent transition-colors" />
          </span> for brands.
        </h1>

        <p
          ref={subTitleRef}
          className="text-lg md:text-2xl text-foreground/70 max-w-2xl mx-auto mb-12 font-sans"
        >
          Creative strategist & video editor helping brands grow through high-converting content.
        </p>

        <div ref={ctaRef} className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button className="group relative px-10 py-4 bg-accent text-background font-bold uppercase tracking-widest overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95">
            <span className="relative z-10">Work With Me</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 group-hover:bg-accent group-hover:text-background transition-all">       
              <Play size={18} fill="currentColor" />
            </div>
            <span>Watch Showreel</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/95 flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-white hover:text-accent transition-colors"
            >
              <X size={40} />
            </button>
            <div className="w-full max-w-5xl aspect-video bg-surface rounded-xl border border-border relative overflow-hidden flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 border-2 border-accent border-dashed rounded-full animate-spin-slow flex items-center justify-center">
                <Play size={32} className="text-accent ml-1" />
              </div>
              <p className="text-accent text-xl tracking-widest">Showreel Coming Soon</p>
              <p className="text-foreground/40 text-sm uppercase font-bold tracking-tighter">Preparing something legendary</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] mb-2 opacity-50 uppercase tracking-widest">Scroll</span>
        <div className="w-[2px] h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}