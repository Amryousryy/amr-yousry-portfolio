"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Zap } from "lucide-react";
import ContactForm from "./ContactForm";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-10 right-10 z-[150] p-5 bg-accent text-background shadow-[0_0_30px_rgba(0,245,212,0.4)] pixel-border hover:scale-110 active:scale-95 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <Zap size={20} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">Get Free Audit</span>
              <MessageSquare size={20} className="md:hidden" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[190]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="fixed bottom-10 right-10 z-[200] w-full max-w-lg bg-background border-2 border-accent p-8 pixel-border shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">
                <div className="flex items-center space-x-3">
                   <Zap size={18} className="text-accent" />
                   <h3 className="font-display font-bold uppercase tracking-tighter text-xl">Free Content Audit</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-accent transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-accent/10 border border-accent/20">
                 <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-relaxed">
                   Limited Time: I'll personally analyze your content strategy and send you a custom roadmap.
                 </p>
              </div>

              <ContactForm isAuditOffer={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
