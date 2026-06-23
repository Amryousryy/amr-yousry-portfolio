"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { aboutContent as staticAboutContent } from "@/content/about";
import { normalizeAboutContent, type PublicAboutContent } from "@/lib/about-content-normalizer";
import CharacterSelector from "./CharacterSelector";

interface AboutSectionProps {
  aboutData?: PublicAboutContent;
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
  const aboutContent = normalizeAboutContent(aboutData, staticAboutContent);

  return (
    <Section id="about" className="bg-brand-blue/95 relative py-14 md:py-20">
      {/* Atmospheric overlay - warm personal tone */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/3 via-transparent to-brand-blue/98 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-pink/15 to-transparent pointer-events-none" />
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            
          {/* Left Column - Story + Cards */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Story Content */}
            <div className="max-w-[620px]">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-pixel text-brand-cyan text-[9px] sm:text-[10px] tracking-[0.24em] sm:tracking-[0.3em] uppercase mb-3 block"
              >
                {aboutContent.badge}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold tracking-tighter text-white break-words"
                style={{ fontSize: 'clamp(1.75rem, 8.6vw, 4.25rem)', lineHeight: '0.96' }}
              >
                {(() => {
                  const parts = aboutContent.heading.split("\n");
                  return parts.map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      <span className={i === 0 ? "text-white" : "text-brand-cyan"}>{part}</span>
                    </span>
                  ));
                })()}
              </motion.h2>
              
              <div className="space-y-4 mt-6">
                {aboutContent.story.map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm md:text-base text-foreground/70 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <p className="text-sm text-foreground/60 mb-3">
                  {aboutContent.ctaIntro}
                </p>
                <Link href={aboutContent.ctaLink} className="group inline-flex min-h-[44px] max-w-full items-center gap-3 sm:gap-4 text-sm font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] border-b border-brand-cyan pb-2">
                  <span>{aboutContent.ctaLabel}</span>
                  <div className="w-8 h-[1px] bg-brand-cyan transition-all group-hover:w-16" />
                </Link>
              </motion.div>
            </div>

            {/* Capability Cards - Below Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 w-full max-w-[620px]">
              {aboutContent.skillClusters.map((cluster) => (
                <motion.div 
                  key={cluster.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/30 border-2 border-slate-800 p-4 w-full min-w-0"
                >
                  <h4 className="font-pixel text-[10px] text-brand-cyan tracking-wider mb-3">{cluster.title}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-slate-700 bg-slate-800/50 px-2 py-1 text-[10px] sm:text-[11px] font-modern text-slate-300/85 uppercase tracking-wider hover:border-brand-cyan hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Mission Sectors Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/30 border-2 border-slate-800 p-4 w-full min-w-0 sm:col-span-2"
              >
                <h4 className="font-pixel text-[10px] text-brand-cyan tracking-wider mb-3">MISSION SECTORS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aboutContent.industries.map((industry) => (
                    <span
                      key={industry}
                      className="border border-slate-700 bg-slate-800/50 px-2 py-1 text-[10px] sm:text-[11px] font-modern text-slate-300/85 uppercase tracking-wider"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Stats + Character */}
          <aside className="lg:col-span-5 flex flex-col space-y-6 h-full">
            {/* Experience Stats */}
            <div className="space-y-4">
              {aboutContent.stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between gap-4 border-t-2 border-slate-800 pt-3"
                >
                  <span className="font-pixel text-[8px] sm:text-[9px] text-brand-cyan tracking-wider uppercase min-w-0">{stat.label}</span>
                  <span className="font-pixel text-xs sm:text-sm md:text-base text-white whitespace-nowrap leading-none text-right">{stat.value}</span>
                </motion.div>
              ))}
            </div>

             {/* Character Visual - Fills Right Column */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group w-full flex-1 min-h-[300px] md:min-h-[520px]"
             >
               <div className="relative w-full h-full bg-slate-900/40 border-2 border-slate-800 p-4 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(var(--color-brand-cyan) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                 />
                 
                  <CharacterSelector />
               </div>
             </motion.div>
          </aside>

        </div>
      </Container>
    </Section>
  );
}
