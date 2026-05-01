"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { PixelButton } from "@/components/ui/pixel-button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full"
    >
      {/* Pixel Frame Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-4 border-slate-800 bg-slate-900 pixel-shadow">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Category Tag - Floating Pixel UI */}
        <div className="absolute top-4 left-4 bg-brand-cyan text-brand-blue font-pixel text-[10px] px-3 py-1 uppercase tracking-wider border-2 border-brand-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow pt-8 pb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl md:text-3xl font-pixel uppercase leading-none">
            {project.title}
          </h3>
          <span className="font-pixel text-brand-cyan text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            LVL. PRO
          </span>
        </div>
        
        <p className="font-modern text-text-dim text-sm uppercase tracking-[0.2em] mb-8">
          <span className="text-brand-pink font-bold">RESULT:</span> {project.mainResult}
        </p>

        <div className="mt-auto">
          <Link href={`/projects/${project.slug}`}>
            <PixelButton variant="outline" size="sm" className="w-full sm:w-auto text-xs py-3">
              View Case Study
            </PixelButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
