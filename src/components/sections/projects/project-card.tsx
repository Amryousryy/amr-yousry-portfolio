"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Project } from "@/types/project-static";
import { PixelButton } from "@/components/ui/pixel-button";
import { formatCategory } from "@/lib/projects/categories";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div 
      initial={false}
      whileHover={shouldReduceMotion ? {} : { y: -10 }}
      className="group relative flex min-w-0 flex-col h-full"
    >
      {/* Pixel Frame Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-slate-800 bg-slate-900 pixel-shadow group-hover:border-brand-cyan/30 transition-colors duration-500">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 border-2 border-slate-700 flex items-center justify-center">
                <span className="font-pixel text-[8px] text-slate-600 tracking-wider">NO SIGNAL</span>
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
        
        {/* Cinematic HUD Accents - Visible on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
          <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* Category Tag - Floating Pixel UI */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-[calc(100%-2rem)] bg-brand-cyan text-brand-blue font-pixel text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 uppercase tracking-wider border border-brand-blue z-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] leading-tight truncate shadow-[0_0_12px_-2px_rgba(34,211,238,0.3)]">
          {formatCategory(project.category)}
        </div>
      </div>

        {/* Content */}
        <div className="flex flex-col flex-grow pt-6 pb-4">
          <div className="min-h-[3.5rem] mb-3">
            <h3 className="text-xl md:text-2xl font-display font-bold group-hover:text-brand-cyan transition-colors duration-500 leading-tight break-words" style={{ textWrap: 'balance' }}>
              {project.title}
            </h3>
          </div>
          
          <div className="min-h-[2.5rem] mb-4">
            {project.summary && (
              <p className="text-sm text-foreground/60 leading-snug line-clamp-2" style={{ textWrap: 'pretty' }}>
                {project.summary}
              </p>
            )}
          </div>

          <div className="mt-auto pt-3">
            {project.slug ? (
              <Link href={`/projects/${project.slug}`} className="block">
                <PixelButton
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-[10px] py-4 group-hover:bg-brand-cyan group-hover:text-brand-blue transition-all"
                >
                  <span>View Project</span>
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </PixelButton>
              </Link>
            ) : (
              <PixelButton
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-[10px] py-4 opacity-40 cursor-not-allowed"
                disabled
              >
                <span>View Project</span>
              </PixelButton>
            )}
          </div>
        </div>
    </motion.div>
  );
}
