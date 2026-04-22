"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";

export default function AuditCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-accent/5 -skew-y-3 origin-left scale-110 -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-12 border-2 border-accent/20 bg-background relative overflow-hidden pixel-border">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap size={200} className="text-accent" />
          </div>

          <div className="space-y-6 relative z-10 text-center md:text-left">
             <div className="inline-flex items-center space-x-3 px-3 py-1 bg-accent text-background text-[10px] font-bold uppercase tracking-widest pixel-border">
                <Zap size={12} fill="currentColor" />
                <span>Limited Offer</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter leading-tight">
               Get a Free 15-Min <br /> <span className="text-accent">Content Audit</span>
             </h2>
             <p className="text-foreground/60 max-w-md text-lg italic">
               We'll analyze your current strategy and give you 3 actionable steps to increase your conversion rate instantly.
             </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/your-number?text=I%20want%20a%20free%20content%20audit"
            className="flex items-center space-x-4 px-12 py-6 bg-accent text-background font-bold uppercase tracking-[0.2em] text-xs pixel-border whitespace-nowrap"
          >
            <span>Start Your Transformation</span>
            <ChevronRight size={18} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
