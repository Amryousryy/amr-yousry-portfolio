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
    if (!containerRef.current || !stripRef.current || projects.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const strip = stripRef.current;
      const container = containerRef.current;
      if (!strip || !container) return;

      const stripWidth = strip.scrollWidth;
      const viewportWidth = window.innerWidth;

      const scrollTween = gsap.to(strip, {
        x: -(stripWidth - viewportWidth + 200),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${stripWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        scrollTween.kill();
      };
    });

    return () => mm.revert();
  }, [projects]);

  if (isLoading) {
    return (
      <section id="projects" ref={containerRef} className="h-screen overflow-hidden bg-[#050508] flex items-center justify-center">
        <div className="pixel-text text-white/50 text-xs animate-pulse">Loading projects...</div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section 
      id="projects" 
      data-section="projects"
      ref={containerRef} 
      className="h-screen overflow-hidden bg-[#050508] will-change-transform"
    >
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-b border-white/5">
        <div className="pixel-text text-[#00ffcc] text-[10px] tracking-widest mr-8">THE WORK</div>
        <div className="flex-1 flex overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-12 h-6 border-r border-white/20 flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-t border-white/5">
        <div className="flex-1 flex overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-12 h-6 border-r border-white/20 flex-shrink-0" />
          ))}
        </div>
        <div className="pixel-text text-white/30 text-[10px] tracking-widest ml-8 uppercase">Scroll to explore work</div>
      </div>

      <div 
        ref={stripRef} 
        className="flex items-center h-full px-[20vw] gap-12 py-16"
      >
        {projects.map((project) => (
          <a
            key={project._id}
            href={`/projects/${project.slug}`}
            data-project
            className="case-study-card flex-shrink-0 w-[450px] bg-[#0a0a0f] border border-white/5 relative group cursor-pointer overflow-hidden transition-colors duration-500 hover:border-accent/30"
            style={{ 
              contentVisibility: 'auto', 
              containIntrinsicSize: 'auto 600px',
              willChange: 'transform'
            } as any}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <div className="w-16 h-16 rounded-full border border-accent bg-accent/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-accent border-b-[6px] border-b-transparent ml-1" />
                </div>
              </div>

              {project.category && (
                <div className="absolute top-4 right-4">
                  <span className="pixel-text text-accent text-[9px] bg-accent/10 backdrop-blur-md px-3 py-1.5 border border-accent/20 uppercase tracking-widest">
                    {project.category}
                  </span>
                </div>
              )}
            </div>

            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <span className="pixel-text text-white/30 text-[9px] uppercase tracking-widest">Selected Work</span>
                <h3 className="text-2xl font-display font-bold text-white tracking-tighter group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
              </div>
              
              <p className="text-white/50 text-sm leading-relaxed line-clamp-2 font-sans">
                {project.shortDescription}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="pixel-text text-white/30 text-[9px] uppercase tracking-widest">
                  {project.year || "2026"}
                </span>
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  View Case Study →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
