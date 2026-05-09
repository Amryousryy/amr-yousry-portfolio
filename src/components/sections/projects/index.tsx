"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { ProjectCard } from "./project-card";
import { featuredProjects } from "@/data/projects";
import Link from "next/link";

export default function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="projects" className="bg-brand-blue/95 pt-14 md:pt-16 pb-16 md:pb-20 relative">
      {/* Atmospheric overlay - subtle warmth */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/95 via-transparent to-brand-blue/98 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent pointer-events-none" />
      
      <Container>
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <div className="max-w-xl">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-4 mb-4"
             >
               <div className="h-[2px] w-12 bg-brand-cyan" />
               <span className="font-pixel text-brand-cyan text-[10px] tracking-[0.3em] uppercase">
                 Mission Log: Selected Works
               </span>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="font-display font-bold tracking-tighter text-white"
               style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4.25rem)', lineHeight: '0.95' }}
             >
               SELECTED<br /><span className="text-brand-cyan">MISSIONS.</span>
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="font-modern text-text-dim/90 text-base md:text-lg leading-relaxed antialiased max-w-lg mt-3"
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
                 <PixelButton variant="outline" className="px-8 py-4 text-xs tracking-widest">
                   Browse Full Archive
                 </PixelButton>
               </Link>
             </motion.div>
           </div>
         </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/projects" className="w-full">
            <PixelButton variant="outline" className="w-full py-5 tracking-widest text-xs">
              View All Projects
            </PixelButton>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
