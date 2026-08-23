"use client";

import { motion } from "framer-motion";
import CommunicationChannels from "./CommunicationChannels";
import type { SocialLinkItem } from "@/lib/contact-content-normalizer";

interface ContactLeftProps {
  content: {
    heading: string;
    subheading: string;
    availability: string;
  };
  email?: string;
  whatsappNumber?: string;
  socials?: SocialLinkItem[];
}

export default function ContactLeft({ content, email, whatsappNumber, socials }: ContactLeftProps) {
  return (
    <div className="lg:col-span-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex min-w-0 items-center gap-3 sm:gap-4 mb-8"
      >
        <div className="h-[2px] w-8 sm:w-12 bg-accent shrink-0" />
        <span className="font-pixel text-accent text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.3em] uppercase">
          Mission Control
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-bold tracking-tighter text-strong mb-6 break-words"
        style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3rem)', lineHeight: '1.1', maxWidth: '14ch' }}
      >
        {content.heading.split("\n").map((line, i, arr) => (
          <span key={i} className="block">
            <span className={i === arr.length - 1 ? "text-accent" : "text-strong"}>{line}</span>
          </span>
        ))}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-modern text-foreground/70 text-sm md:text-base leading-relaxed max-w-[420px]"
        style={{ textWrap: 'pretty' }}
      >
        {content.subheading}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="font-pixel text-[9px] text-accent/80 tracking-[0.15em] mt-4 mb-10"
      >
        {content.availability}
      </motion.p>

      <CommunicationChannels
        email={email}
        whatsappNumber={whatsappNumber}
        socials={socials}
      />
    </div>
  );
}
