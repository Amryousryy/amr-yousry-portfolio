"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { featuredProjects } from "@/data/projects";

export default function PortfolioPreview() {
  const projects = featuredProjects.slice(0, 3);

  return (
    <section className="pt-14 md:pt-16 pb-16 md:pb-20 bg-background border-t border-primary/10">
      <div className="container mx-auto px-6">
        <div className="mb-8 md:mb-10">
          <div className="max-w-xl">
            <h2 className="pixel-text text-accent/60 text-[10px] mb-2 tracking-[0.3em]">Mission Log: Selected Works</h2>
            <h3 className="font-display font-bold tracking-tighter text-white" style={{ fontSize: 'clamp(2.25rem, 4.2vw, 4.25rem)', lineHeight: '0.95' }}>
              SELECTED<br /><span className="text-accent">MISSIONS.</span>
            </h3>
            <p className="text-body text-foreground/70 mt-3 max-w-lg">
              A curated set of video-led projects, concepts, and campaign stories.
            </p>
            <Link
              href="/projects"
              className="group inline-flex items-center space-x-4 text-sm font-bold uppercase tracking-[0.2em] border-b border-accent pb-2 mt-5"
            >
              <span>Browse Full Archive</span>
              <div className="w-8 h-[1px] bg-accent transition-all group-hover:w-16" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={['/projects', project.slug].join('/')} className="block">
                <div className="relative aspect-video overflow-hidden pixel-border mb-3">
                  <Image
                    src={project.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="pixel-text text-background bg-accent px-6 py-2 font-bold">
                      View Project
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-accent font-bold uppercase tracking-widest block mb-1 pixel-text">
                  {project.category}
                </span>
                <h4 className="text-lg font-display font-bold group-hover:text-accent transition-colors leading-snug">
                  {project.title}
                </h4>
                {project.summary && (
                  <p className="text-sm text-foreground/60 mt-1.5 line-clamp-2">
                    {project.summary}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}