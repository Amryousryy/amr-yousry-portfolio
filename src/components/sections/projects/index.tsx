"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { ProjectCard } from "./project-card";
import { featuredProjects } from "@/data/projects";
import Link from "next/link";

export function ProjectsSection() {
  return (
    <Section id="projects" className="bg-brand-blue/50">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-pixel text-brand-cyan text-sm tracking-widest mb-4 block"
            >
              MISSION LOG: SELECTED WORKS
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
            >
              Proven Results. High Impact.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-modern text-text-dim text-lg leading-relaxed antialiased"
            >
              A selection of projects that bridge the gap between cinematic visual artistry and measurable business conversion.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <PixelButton variant="outline" className="hidden md:flex">
                All Projects
              </PixelButton>
            </Link>
          </motion.div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-16 flex justify-center md:hidden">
          <Link href="/projects">
            <PixelButton variant="outline" className="w-full">
              All Projects
            </PixelButton>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
