"use client";

import React from "react";
import { motion } from "framer-motion";

const brands = [
  "REAL ESTATE CO", "LUXURY LIVING", "TECH PULSE", "MODERN AGENCY", "VIBE MEDIA", "GLOBAL BRANDS"
];

export default function ClientMarquee() {
  return (
    <div className="py-12 bg-primary/5 border-y border-primary/10 overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <p className="pixel-text text-[10px] text-accent/50 text-center tracking-[0.5em] uppercase">Trusted by Industry Leaders</p>
      </div>
      
      <div className="flex w-full overflow-hidden relative">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {/* Double the list for infinite effect */}
          {[...brands, ...brands].map((brand, i) => (
            <span 
              key={i} 
              className="text-2xl md:text-4xl font-display font-black text-foreground/20 hover:text-accent transition-colors cursor-default uppercase tracking-tighter"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
