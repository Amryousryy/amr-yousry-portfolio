"use client";

import { motion } from "framer-motion";

interface AboutStatsProps {
  stats: { label: string; value: string }[];
}

export default function AboutStats({ stats }: AboutStatsProps) {
  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="flex items-baseline justify-between gap-4 border-t-2 border-line py-3"
        >
          <span className="font-pixel text-[9px] sm:text-[10px] text-accent/70 tracking-[0.2em] uppercase min-w-0">{stat.label}</span>
          <span className="font-pixel text-[11px] sm:text-xs text-strong whitespace-nowrap leading-none text-right tracking-wide">{stat.value}</span>
        </motion.div>
      ))}
    </>
  );
}
