"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 bg-primary/5 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square w-full max-w-md mx-auto pixel-border overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                alt="Amr Yousry"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 z-[-1] animate-pulse" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 z-[-1]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="pixel-text text-accent text-sm mb-4">The Strategist</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Creating content that <br />
              <span className="text-secondary">actually works.</span>
            </h3>
            <div className="space-y-6 text-lg text-foreground/70 font-sans">
              <p>
                In a world of noise, I focus on the signals that matter. I do not just edit videos; I engineer high-converting digital assets that turn casual viewers into loyal clients.
              </p>
              <p>
                My approach combines the precision of a strategist with the creativity of a cinematic editor. Every frame, every cut, and every hook is calculated to drive business growth.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="pixel-text text-accent text-xs mb-2">Experience</h4>
                  <p className="font-display font-bold text-2xl">5+ Years</p>
                </div>
                <div>
                  <h4 className="pixel-text text-accent text-xs mb-2">Conversion</h4>
                  <p className="font-display font-bold text-2xl">+40% Avg.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
