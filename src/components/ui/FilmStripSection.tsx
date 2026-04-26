"use client";

import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectService } from "@/lib/api-client";

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  image: string;
  results?: string;
  clientName?: string;
  year?: string;
  featured: boolean;
}

const EMPTY_PROJECTS: ProjectData[] = [];

export default function FilmStripSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => ProjectService.getAll(false, { featured: true, limit: 10 }),
  });

  const projects = projectsData?.data || EMPTY_PROJECTS;

  useEffect(() => {
    if (!containerRef.current || !stripRef.current) return;

    const ctx = gsap.context(() => {
      const stripWidth = stripRef.current?.scrollWidth || 0;
      const viewportWidth = window.innerWidth;

      gsap.to(stripRef.current, {
        x: -(stripWidth - viewportWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${stripWidth * 0.8}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" ref={containerRef} className="h-screen overflow-hidden bg-[#050508] flex items-center justify-center">
        <div className="pixel-text text-white/50 text-xs">Loading projects...</div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" ref={containerRef} className="h-screen overflow-hidden bg-[#050508]">
        <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-b border-[#1a1a2e]">
          <div className="pixel-text text-[#00ffcc] text-xs mr-8">THE WORK</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-t border-[#1a1a2e]" />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-white/50 text-lg mb-2">No featured projects yet</p>
            <p className="text-white/30 text-sm">Mark projects as featured in the admin panel</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={containerRef} className="h-screen overflow-hidden bg-[#050508]">
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-b border-[#1a1a2e]">
        <div className="pixel-text text-[#00ffcc] text-xs mr-8">THE WORK</div>
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-10 h-8 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1 flex-shrink-0" />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-t border-[#1a1a2e]">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-10 h-8 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1 flex-shrink-0" />
        ))}
        <div className="pixel-text text-white/50 text-xs ml-8">SCROLL →</div>
      </div>

      <div ref={stripRef} className="flex items-center h-full px-[60vw] gap-8 py-16">
        {projects.map((project) => (
          <a
            key={project._id}
            href={`/projects/${project.slug}`}
            data-project
            id={`project-${project._id}`}
            className="case-study-card flex-shrink-0 w-[480px] bg-[#0a0a0f] border-2 border-[#1a1a2e] relative group cursor-pointer overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={project.image}
                alt={`${project.title}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              {project.featured && (
                <div className="absolute top-3 left-3">
                  <span className="pixel-text text-[#ffd700] text-xs bg-[#ffd700]/20 px-2 py-1">
                    ★ FEATURED
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full border-2 border-[#00ffcc] bg-[#00ffcc]/20 flex items-center justify-center">
                  <span className="text-[#00ffcc] text-3xl">▶</span>
                </div>
              </div>
              {project.category && (
                <div className="absolute top-3 right-3">
                  <span className="pixel-text text-[#00ffcc] text-xs bg-[#00ffcc]/20 px-2 py-1">
                    {project.category.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                {project.year && (
                  <>
                    <span className="pixel-text text-white/70 text-xs">{project.year}</span>
                    <span className="pixel-text text-white/50 text-xs mx-2">•</span>
                  </>
                )}
                <span className="pixel-text text-white/70 text-xs">VIEW PROJECT</span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {project.clientName && (
                <div className="flex items-center gap-3">
                  <span className="pixel-text text-white/50 text-xs">CLIENT:</span>
                  <span className="text-white font-sora text-lg">{project.clientName}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="pixel-text text-white/50 text-xs">TYPE:</span>
                <span className="pixel-text text-[#00ffcc] text-xs">{project.category || "Project"}</span>
              </div>
              <div className="h-px bg-[#1a1a2e] my-2" />
              <h3 className="font-sora text-xl text-white mb-1">{project.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{project.shortDescription}</p>
              {project.results && (
                <div className="pixel-box bg-[#00ffcc]/10 p-3 mt-2">
                  <div className="pixel-text text-[#00ffcc] text-xs mb-1">RESULTS</div>
                  <div className="text-white font-sora text-sm">{project.results}</div>
                </div>
              )}
            </div>

            <div className="absolute inset-0 border-2 border-[#00ffcc]/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </a>
        ))}
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <div className="pixel-box bg-[#0a0a0f]/90 p-4">
          <div className="pixel-text text-[#00ffcc] text-xs mb-2">{projects.length} PROJECTS</div>
          <div className="pixel-text text-white/50 text-xs">SCROLL TO EXPLORE</div>
        </div>
      </div>
    </section>
  );
}