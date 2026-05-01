"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { aboutContent } from "@/content/about";

export function AboutSection() {
  return (
    <Section id="about" className="bg-brand-blue relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Story Content */}
          <div className="lg:col-span-7">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-pixel text-brand-cyan text-sm tracking-widest mb-4 block"
            >
              {aboutContent.badge}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl mb-12"
            >
              {aboutContent.heading}
            </motion.h2>
            
            <div className="space-y-8">
              {aboutContent.story.map((paragraph, index) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="font-modern text-lg md:text-xl text-text-dim leading-relaxed antialiased"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Sidebar / Stats & Disciplines */}
          <aside className="lg:col-span-5 space-y-16">
            {/* Experience Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {aboutContent.stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t border-slate-800 pt-6"
                >
                  <span className="font-pixel text-[10px] text-brand-cyan tracking-widest block mb-2">{stat.label}</span>
                  <span className="font-pixel text-2xl text-white">{stat.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Disciplines / Skill Tree */}
            <div className="bg-slate-900/30 border-4 border-slate-800 p-8 pixel-shadow">
              <h3 className="font-pixel text-xs text-white mb-8 tracking-widest">MASTERED DISCIPLINES</h3>
              <div className="flex flex-wrap gap-3">
                {aboutContent.disciplines.map((discipline, index) => (
                  <motion.span
                    key={discipline}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-slate-700 bg-slate-800/50 px-3 py-1 text-[10px] font-modern text-text-dim uppercase tracking-wider hover:border-brand-cyan hover:text-white transition-colors cursor-default"
                  >
                    {discipline}
                  </motion.span>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </Container>
    </Section>
  );
}
