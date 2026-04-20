"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { Project } from "@/types";

const categories = ["All", "Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await ProjectService.getAll();
      if (error) throw new Error(error);
      return data || [];
    },
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (filter === "All") return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8">
            The <span className="text-accent italic">Gallery</span>
          </h1>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all pixel-border ${
                  filter === cat ? "bg-accent text-background" : "bg-transparent text-foreground/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  <Link href={`/projects/${project._id}`} className="block">
                    <div className="relative aspect-video overflow-hidden pixel-border mb-6">
                      <Image
                        src={project.image}
                        alt={project.title.en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="pixel-text text-accent text-[10px] mb-2 block uppercase">{project.category}</span>
                    <h3 className="text-2xl font-display font-bold group-hover:text-accent transition-colors">{project.title.en}</h3>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-primary/10">
            <p className="text-foreground/30 pixel-text uppercase tracking-widest">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
