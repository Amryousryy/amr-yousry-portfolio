"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProjectService } from "@/lib/api-client";
import { Project } from "@/types";

interface RelatedProjectsProps {
  currentSlug: string;
  category?: string;
}

export default function RelatedProjects({ currentSlug, category }: RelatedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await ProjectService.getAll();
        const data = Array.isArray(response?.data) ? response.data : [];
        if (data.length > 0) {
          // Filter out current project and preferably show projects from same category
          const filtered = data
            .filter(p => p.slug !== currentSlug)
            .sort((a, b) => {
                if (a.category === category && b.category !== category) return -1;
                if (a.category !== category && b.category === category) return 1;
                return 0;
            })
            .slice(0, 3);
          setProjects(filtered);
        }
      } catch (err) {
        console.error("RelatedProjects: Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentSlug, category]);

  if (projects.length === 0 && !loading) return null;

  return (
    <section className="py-24 border-t border-primary/10">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="pixel-text text-accent text-[10px] uppercase tracking-[0.4em]">Next Exploration</h2>
            <h3 className="text-5xl font-display font-bold uppercase tracking-tighter">More Case Studies</h3>
          </div>
          <Link href="/projects" className="pixel-text text-[10px] uppercase underline text-foreground/40 hover:text-accent transition-colors">
            View Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-primary/5 mb-6 pixel-border" />
                <div className="h-4 bg-primary/5 w-1/3 mb-4" />
                <div className="h-8 bg-primary/5 w-full" />
              </div>
            ))
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden pixel-border mb-8 bg-primary/5">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-3 pixel-text">
                    {project.category}
                  </span>
                  <h4 className="text-3xl font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h4>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
