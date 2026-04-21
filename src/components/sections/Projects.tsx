"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web",
    description: "Full-featured e-commerce platform with Next.js, Stripe integration, and admin dashboard.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    size: "large",
  },
  {
    id: 2,
    title: "AI Chat Application",
    category: "AI",
    description: "Real-time AI chat application with multiple model support and streaming responses.",
    tags: ["React", "OpenAI API", "WebSocket"],
    size: "small",
  },
  {
    id: 3,
    title: "Portfolio Generator",
    category: "Web",
    description: "Drag-and-drop portfolio builder with customizable templates and export functionality.",
    tags: ["Next.js", "TypeScript", "Framer"],
    size: "medium",
  },
  {
    id: 4,
    title: "Content Scheduler",
    category: "Web",
    description: "Social media content scheduler with analytics and AI-powered post suggestions.",
    tags: ["React", "Node.js", "AI"],
    size: "medium",
  },
  {
    id: 5,
    title: "Video Analytics Dashboard",
    category: "Design",
    description: "Analytics dashboard for video content creators with engagement metrics visualization.",
    tags: ["Next.js", "D3.js", "Analytics"],
    size: "small",
  },
];

const categories = ["All", "Web", "AI", "Design"];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    setFilteredProjects(
      activeFilter === "All" 
        ? projects 
        : projects.filter(p => p.category === activeFilter)
    );
  }, [activeFilter]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".projects-header", {
        scrollTrigger: {
          trigger: ".projects-header",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: ".project-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="projects-header mb-16">
          <span className="text-accent text-sm uppercase tracking-widest mb-4 block">
            My Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-8">
            Projects
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-accent text-background"
                    : "bg-surface-elevated text-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`project-card group relative bg-surface-elevated rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:ring-2 hover:ring-accent/50 ${
                project.size === "large" ? "md:col-span-2" : 
                project.size === "medium" ? "md:col-span-1 lg:col-span-1" : 
                "md:col-span-1"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs bg-background/80 backdrop-blur rounded-full">
                  {project.category}
                </span>
              </div>

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 bg-background rounded-full hover:bg-accent hover:text-background transition-colors"
                      aria-label="View on GitHub"
                    >
                      <Github size={16} />
                    </button>
                    <button 
                      className="p-2 bg-background rounded-full hover:bg-accent hover:text-background transition-colors"
                      aria-label="View live demo"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}