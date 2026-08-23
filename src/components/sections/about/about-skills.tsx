"use client";

import { motion } from "framer-motion";

interface AboutSkillsProps {
  clusters: { title: string; skills: string[] }[];
  industries: string[];
}

export default function AboutSkills({ clusters, industries }: AboutSkillsProps) {
  return (
    <>
      {clusters.map((cluster) => (
        <motion.div
          key={cluster.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-panel-soft border-2 border-line p-4 w-full min-w-[260px] sm:min-w-0 shrink-0 snap-start"
        >
          <h4 className="font-pixel text-[11px] text-accent tracking-wider mb-3">{cluster.title}</h4>
          <div className="flex flex-wrap gap-1.5">
            {cluster.skills.map((skill) => (
              <span
                key={skill}
                className="border border-line-soft bg-tag px-2 py-1 text-[10px] sm:text-[11px] font-modern text-strong-dim uppercase tracking-wider hover:border-accent hover:text-strong active:border-accent active:text-strong transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-panel-soft border-2 border-line p-4 w-full min-w-[260px] sm:min-w-0 shrink-0 snap-start sm:col-span-2"
      >
        <h4 className="font-pixel text-[10px] text-accent tracking-wider mb-3">MISSION SECTORS</h4>
        <div className="flex flex-wrap gap-1.5">
          {industries.map((industry) => (
            <span
              key={industry}
              className="border border-line-soft bg-tag px-2 py-1 text-[10px] sm:text-[11px] font-modern text-strong-dim uppercase tracking-wider"
            >
              {industry}
            </span>
          ))}
        </div>
      </motion.div>
    </>
  );
}
