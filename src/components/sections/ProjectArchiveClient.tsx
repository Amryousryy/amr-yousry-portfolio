"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { Loader2, Star, Filter as FilterIcon, X } from "lucide-react";
import { Project } from "@/types";

const categories = ["All", "Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface ProjectArchiveClientProps {
  initialProjects?: Project[];
}

export default function ProjectArchiveClient({ initialProjects = [] }: ProjectArchiveClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const projectsData: Project[] = Array.isArray(initialProjects) ? initialProjects : [];

  const { data: liveData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ProjectService.getAll();
      return Array.isArray(res?.data) ? res.data : [];
    },
    initialData: projectsData,
  });

  const safeProjects = Array.isArray(liveData) ? liveData : [];

  // Extract all unique tags from currently filtered category
  const availableTags = useMemo(() => {
    const filteredByCategory = activeCategory === "All" 
      ? safeProjects 
      : (safeProjects || []).filter((p: Project) => p.category === activeCategory);
    
    const tags = new Set<string>();
    filteredByCategory.forEach((p: Project) => p.tags?.forEach((t: string) => tags.add(t)));
    return Array.from(tags);
  }, [safeProjects, activeCategory]);

  const filteredProjects = useMemo(() => {
    let filtered = safeProjects;

    if (activeCategory !== "All") {
      filtered = (filtered || []).filter((p: Project) => p.category === activeCategory);
    }

    if (activeTags.length > 0) {
      filtered = (filtered || []).filter((p: Project) => 
        activeTags.every(tag => p.tags?.includes(tag))
      );
    }

    return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [safeProjects, activeCategory, activeTags]);

  const featuredProject = useMemo(() => {
    return safeProjects?.find(p => p.featured && p.status === "published");
  }, [safeProjects]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (isLoading && !projectsData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-accent mb-4" size={48} />
        <p className="pixel-text text-[10px] uppercase tracking-widest animate-pulse">Loading Archive</p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <header>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-display font-bold tracking-tighter mb-12"
        >
          THE <span className="text-accent italic">ARCHIVE</span>
        </motion.h1>

        {/* Featured Spotlight */}
        {featuredProject && activeCategory === "All" && activeTags.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[21/9] mb-20 group overflow-hidden pixel-border"
          >
            <Link href={`/projects/${featuredProject.slug}`}>
              <Image
                src={featuredProject.image}
                alt={featuredProject.title.en}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                 <div className="flex items-center space-x-3 mb-4">
                    <Star className="text-accent fill-accent" size={16} />
                    <span className="pixel-text text-accent text-[10px] uppercase tracking-[0.3em]">Featured Work</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4 group-hover:text-accent transition-colors">{featuredProject.title.en}</h2>
                 <p className="text-foreground/60 max-w-xl text-sm md:text-base italic">{featuredProject.shortDescription.en}</p>
              </div>
            </Link>
          </motion.div>
        )}
        
        <div className="space-y-8">
          {/* Category Filter */}
          <div className="flex flex-col space-y-4">
            <span className="pixel-text text-[10px] text-accent uppercase tracking-widest">Collections</span>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveTags([]); // Reset tags when category changes
                  }}
                  className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all pixel-border ${
                    activeCategory === cat ? "bg-accent text-background" : "bg-primary/5 text-foreground/50 hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="pixel-text text-[10px] text-accent uppercase tracking-widest">Refine by Tag</span>
                {activeTags.length > 0 && (
                  <button 
                    onClick={() => setActiveTags([])}
                    className="flex items-center space-x-2 text-[9px] uppercase font-bold text-foreground/40 hover:text-accent transition-colors"
                  >
                    <div className="p-0.5 border border-current">
                       <X size={10} />
                    </div>
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
                      activeTags.includes(tag) 
                        ? "bg-secondary text-background border border-secondary" 
                        : "bg-transparent border border-primary/10 text-foreground/40 hover:border-accent hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="group flex flex-col"
            >
              <Link href={`/projects/${project.slug}`} className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden pixel-border mb-8 bg-primary/5">
                  <Image
                    src={project.image}
                    alt={project.title.en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     <span className="px-3 py-1 bg-background text-foreground text-[8px] font-bold uppercase tracking-widest w-fit">
                       {project.category}
                     </span>
                     {project.featured && (
                       <div className="p-1.5 bg-accent text-background w-fit">
                          <Star size={10} fill="currentColor" />
                       </div>
                     )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[8px] text-accent uppercase font-bold tracking-widest">#{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
                    {project.title.en}
                  </h3>
                  <p className="text-sm text-foreground/40 line-clamp-2 leading-relaxed italic">
                    {project.shortDescription.en}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 border border-dashed border-primary/10"
        >
          <FilterIcon className="mx-auto text-foreground/10 mb-6" size={48} />
          <p className="text-foreground/30 pixel-text text-sm uppercase tracking-[0.3em]">No matches found in the archives.</p>
          <button 
            onClick={() => { setActiveCategory("All"); setActiveTags([]); }}
            className="mt-8 text-accent pixel-text text-[10px] uppercase underline hover:text-secondary transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
