"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { PublicAboutContent } from "@/lib/about-content-normalizer";

interface AboutLeftProps {
  content: PublicAboutContent;
}

export default function AboutLeft({ content }: AboutLeftProps) {
  const [storyExpanded, setStoryExpanded] = useState(false);

  return (
    <>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="font-pixel text-accent text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.3em] uppercase mb-3 block"
      >
        {content.badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-bold tracking-tighter text-strong break-words"
        style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3rem)', lineHeight: '1.1', maxWidth: '14ch' }}
      >
        {(() => {
          const parts = content.heading.split("\n");
          return parts.map((part, i) => (
            <span key={i} className="block">
              <span className={i === parts.length - 1 ? "text-accent" : "text-strong"}>{part}</span>
            </span>
          ));
        })()}
      </motion.h2>

      <div className="space-y-4 mt-6">
        {content.story.slice(0, 2).map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-sm md:text-base text-foreground/70 leading-relaxed"
            style={{ textWrap: 'pretty', maxWidth: '60ch' }}
          >
            {paragraph}
          </motion.p>
        ))}
        {content.story.length > 2 && !storyExpanded && (
          <button
            type="button"
            onClick={() => setStoryExpanded(true)}
            className="font-pixel text-[11px] text-accent/70 hover:text-accent tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
          >
            Continue the story →
          </button>
        )}
        {storyExpanded && content.story.slice(2).map((paragraph, index) => (
          <motion.p
            key={index + 2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm md:text-base text-foreground/70 leading-relaxed"
            style={{ textWrap: 'pretty', maxWidth: '60ch' }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <p className="text-sm text-foreground/60 mb-3">
          {content.ctaIntro}
        </p>
        <Link href={content.ctaLink} className="group inline-flex min-h-[44px] max-w-full items-center gap-3 sm:gap-4 text-sm font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] border-b border-accent py-2">
          <span>{content.ctaLabel}</span>
          <div className="w-8 h-[1px] bg-accent transition-all group-hover:w-16" />
        </Link>
      </motion.div>
    </>
  );
}
