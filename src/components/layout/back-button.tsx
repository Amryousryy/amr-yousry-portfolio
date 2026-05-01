"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

export function BackButton() {
  return (
    <Link href="/projects">
      <motion.div 
        whileHover={{ x: -4 }}
        className="inline-flex items-center gap-2 text-text-dim hover:text-brand-cyan transition-colors group mb-12"
      >
        <span className="font-pixel text-lg">{"<"}</span>
        <span className="font-pixel text-[10px] tracking-widest uppercase">Back to Archive</span>
      </motion.div>
    </Link>
  );
}
