"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/tracker";
import { ProjectMediaItem } from "@/types/project";
import ProjectMediaGallery from "@/components/projects/ProjectMediaGallery";

interface CaseStudyClientProps {
  project: {
    problem?: string;
    idea?: string;
    execution?: string;
    detailedResults?: { label: string; value: string }[];
    metrics?: { label: string; value: string }[];
    media?: ProjectMediaItem[];
    title: string;
    slug?: string;
  };
}

export function CaseStudyClient({ project }: CaseStudyClientProps) {
  const detailedResults = project.detailedResults ?? project.metrics ?? [];
  const galleryItems = project.media ?? [];

  useEffect(() => {
    const slug = project.slug || window.location.pathname.split("/").pop() || "";
    trackEvent("project_detail_view", { path: window.location.pathname, projectSlug: slug });
  }, [project.slug]);

  return (
    <>
      {/* Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            {project.problem && (
              <div>
                <h2 className="font-pixel text-brand-cyan text-xs sm:text-sm tracking-widest uppercase mb-4">
                  Problem
                </h2>
                <p className="font-modern text-base md:text-lg text-foreground/80 leading-relaxed">
                  {project.problem}
                </p>
              </div>
            )}

            {project.idea && (
              <div>
                <h2 className="font-pixel text-brand-cyan text-xs sm:text-sm tracking-widest uppercase mb-4">
                  The Idea
                </h2>
                <p className="font-modern text-base md:text-lg text-foreground/80 leading-relaxed">
                  {project.idea}
                </p>
              </div>
            )}

            {project.execution && (
              <div>
                <h2 className="font-pixel text-brand-cyan text-xs sm:text-sm tracking-widest uppercase mb-4">
                  Execution
                </h2>
                <p className="font-modern text-base md:text-lg text-foreground/80 leading-relaxed">
                  {project.execution}
                </p>
              </div>
            )}

            {detailedResults.length > 0 && (
              <div>
                <h2 className="font-pixel text-brand-cyan text-xs sm:text-sm tracking-widest uppercase mb-4">
                  Result
                </h2>
                <div className="space-y-4">
                  {detailedResults.map((result, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 pb-4 border-b border-slate-800 last:border-0">
                      <span className="font-pixel text-2xl sm:text-3xl text-white break-words">{result.value}</span>
                      <span className="font-pixel text-[10px] text-text-dim tracking-wider uppercase break-words">{result.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {detailedResults.length > 0 && (
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border-2 border-slate-800 p-5 sm:p-8 sticky top-24"
            >
              <h3 className="font-pixel text-brand-cyan text-xs tracking-widest uppercase mb-6">
                Key Results
              </h3>
              <div className="space-y-6">
                {detailedResults.map((result, i) => (
                  <div key={i} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0">
                    <span className="font-pixel text-text-dim text-[10px] tracking-wider">
                      {result.label}
                    </span>
                    <p className="font-pixel text-xl sm:text-2xl text-white mt-1 break-words">
                      {result.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Project Media Gallery */}
      {galleryItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="font-pixel text-brand-cyan text-xs sm:text-sm tracking-widest uppercase mb-8">
            Project Media
          </h2>
          <ProjectMediaGallery items={galleryItems} title={project.title} />
        </motion.div>
      )}
    </>
  );
}
