"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/tracker";
import { PROJECT_CATEGORIES, formatCategory } from "@/lib/projects/categories";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories: string[];
  summary: string;
  mainResult: string;
  thumbnail: string;
}

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.categories?.includes(activeFilter));

  return (
    <>
      {/* Section Header */}
      <div className="mb-14 md:mb-20 min-w-0">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-brand-cyan text-[10px] sm:text-sm tracking-widest mb-4 block"
        >
          MISSION LOG: SELECTED WORKS
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(2rem,6.5vw,3.5rem)] md:text-5xl lg:text-6xl mb-6 break-words leading-tight"
          style={{ textWrap: 'balance', maxWidth: '18ch' }}
        >
          Proven Results. High Impact.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-modern text-text-dim text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ textWrap: 'pretty' }}
        >
          A selection of projects that bridge the gap between cinematic visual artistry and measurable business conversion.
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 md:mb-14">
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveFilter(cat.value);
              trackEvent("category_filter_click", { path: "/projects", category: cat.value });
            }}
            className={`font-pixel text-[9px] sm:text-[10px] tracking-widest uppercase px-4 sm:px-5 py-2.5 sm:py-3 border-2 transition-all duration-200 min-h-[44px] ${
              activeFilter === cat.value
                ? "bg-brand-cyan text-brand-blue border-brand-cyan"
                : "bg-transparent text-text-dim border-slate-700 hover:border-brand-cyan hover:text-brand-cyan"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block min-w-0"
                onClick={() => trackEvent("project_card_click", { path: "/projects", projectSlug: project.slug })}
              >
                <div className="relative overflow-hidden pixel-border mb-6 bg-slate-900/50">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="space-y-2">
                  <span className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase">
                    {formatCategory(project.category)}
                  </span>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tighter group-hover:text-brand-cyan transition-colors break-words leading-tight" style={{ textWrap: 'balance' }}>
                    {project.title}
                  </h3>
                  <p className="font-modern text-text-dim text-sm">
                    {project.summary || project.mainResult}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="font-pixel text-text-dim text-sm tracking-wider">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
