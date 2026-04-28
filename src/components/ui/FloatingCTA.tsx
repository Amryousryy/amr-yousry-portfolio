"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Calendar, ArrowRight } from "lucide-react";
import { ContactForm } from "./ContactForm";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 800) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
            className="fixed bottom-8 right-8 z-[150] px-6 py-4 bg-accent text-background font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Calendar size={18} />
            <span className="hidden md:block">Book a Free Call</span>
            <span className="md:hidden">Contact</span>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-[200] w-full md:w-full md:max-w-md bg-background border-t md:border border-white/10 p-6 md:p-8 shadow-2xl rounded-t-2xl md:rounded-none"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-accent" />
                  <h3 className="font-bold text-xl text-white">Let&apos;s Talk</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  Have a project in mind? Send me the details and I&apos;ll get back to you within 24 hours to discuss how we can work together.
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