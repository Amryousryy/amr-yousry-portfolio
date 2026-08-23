"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PixelButton } from "@/components/ui/pixel-button";

export default function ProjectsHeader() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex min-w-0 items-center gap-3 sm:gap-4 mb-4"
      >
        <div className="h-[2px] w-8 sm:w-12 bg-accent shrink-0" />
        <span className="font-pixel text-accent text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.3em] uppercase">
          Mission Log: Selected Works
        </span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display font-bold tracking-tighter text-strong break-words"
        style={{ fontSize: 'clamp(1.95rem, 6.5vw, 3.5rem)', lineHeight: '1.05', maxWidth: '16ch', textWrap: 'balance' }}
      >
        SELECTED<br /><span className="text-accent">MISSIONS.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-modern text-text-dim/90 text-base md:text-lg leading-relaxed antialiased max-w-lg mt-3"
        style={{ textWrap: 'pretty' }}
      >
        A curated set of video-led projects, concepts, and campaign stories.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-5"
      >
        <Link href="/projects">
          <PixelButton variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-4 text-xs tracking-widest">
            Browse Full Archive
          </PixelButton>
        </Link>
      </motion.div>
    </>
  );
}
