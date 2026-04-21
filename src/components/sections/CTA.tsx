"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-12 leading-tight"
          >
            Let us grow your brand with content that <span className="text-accent italic underline">converts.</span>
          </motion.h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/your-number"
              className="flex items-center space-x-4 px-10 py-5 bg-accent text-background font-bold uppercase tracking-widest rounded-full hover:bg-accent/90 transition-all"
            >
              <MessageSquare size={24} />
              <span>WhatsApp Me</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:amr@example.com"
              className="flex items-center space-x-4 px-10 py-5 border border-accent text-accent font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-background transition-all"
            >
              <Mail size={24} />
              <span>Send Email</span>
            </motion.a>
          </div>

          <p className="mt-12 text-foreground/40 text-sm uppercase tracking-widest">
            Available for new projects in 2026
          </p>
        </div>
      </div>
    </section>
  );
}