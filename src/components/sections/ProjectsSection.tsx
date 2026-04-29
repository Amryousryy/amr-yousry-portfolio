"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  metrics: {
    views?: string;
    roi?: string;
    conversion?: string;
    client?: string;
  };
  testimonial?: {
    quote: string;
    author: string;
  };
  slug: string;
}

const PROJECTS: Project[] = [
  {
    title: "Luxury Brand Film",
    category: "Brand Storytelling",
    description: "A cinematic brand film for a luxury fashion label, telling their heritage story through motion.",
    image: "https://images.unsplash.com/photo-1539107515679-261c5b31d3c?w=800",
    metrics: {
      views: "2M+",
      roi: "4X",
      client: "Maison Élégante",
    },
    testimonial: {
      quote: "Transformed our brand perception completely.",
      author: "Creative Director",
    },
    slug: "luxury-brand-film",
  },
  {
    title: "Tech Startup Reel",
    category: "Motion Design",
    description: "Dynamic motion graphics package for a Series A tech startup's investor pitch.",
    image: "https://images.unsplash.com/photo-1550745165-731e2e4dd6e?w=800",
    metrics: {
      views: "1.5M+",
      conversion: "+340%",
      client: "DataFlow",
    },
    testimonial: {
      quote: "Secured $5M in Series A after this reel.",
      author: "CEO, DataFlow",
    },
    slug: "tech-startup-reel",
  },
  {
    title: "Travel Series",
    category: "Content Strategy",
    description: "End-to-end content strategy and editing for a travel influencer's YouTube series.",
    image: "https://images.unsplash.com/photo-1488644615296-10ddf06822d3?w=800",
    metrics: {
      views: "5M+",
      roi: "3.5X",
      client: "Wanderlust Co.",
    },
    testimonial: {
      quote: "Grew from 10K to 500K subscribers in 6 months.",
      author: "Founder",
    },
    slug: "travel-series",
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".project-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          card.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} data-frame="03" className="relative min-h-screen w-full bg-[#050508] section-padding">
      {/* Frame Logic - Timeline markers */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header - Frame Logic */}
        <div className="mb-20 reveal">
          <div className="frame-number mb-2">FRAME 03</div>
          <div className="frame-divider" />
          <h2 className="text-section text-white">
            <span className="frame-label">SELECTS</span>
            <br />
            Featured Work
          </h2>
        </div>

        {/* Projects grid - proof-focused layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <a
              key={i}
              href={`/projects/${project.slug}`}
              className="project-card reveal group relative bg-[#0a0a0f] overflow-hidden border border-white/5 hover:border-[#00ffcc]/30 transition-all duration-500"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Thumbnail */}
              <div
                className="aspect-video bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              />

              {/* Content - always visible metrics */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-mono text-[#00ffcc] text-[10px] tracking-wider">
                    {project.category}
                  </div>
                  <div className="frame-number text-[8px]">
                    FRAME {String(i + 1).padStart(2, '0')}
                  </div>
                </div>

                <h3 className="text-display text-white mb-3 group-hover:text-[#00ffcc] transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Proof metrics - key differentiator from Services */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.metrics.views && (
                    <div className="px-3 py-1 bg-[#00ffcc]/5 border border-[#00ffcc]/20">
                      <div className="text-[#00ffcc] text-xs font-bold">{project.metrics.views}</div>
                      <div className="text-mono text-white/40 text-[8px]">VIEWS</div>
                    </div>
                  )}
                  {project.metrics.roi && (
                    <div className="px-3 py-1 bg-[#00ffcc]/5 border border-[#00ffcc]/20">
                      <div className="text-[#00ffcc] text-xs font-bold">{project.metrics.roi} ROI</div>
                      <div className="text-mono text-white/40 text-[8px]">RETURN</div>
                    </div>
                  )}
                  {project.metrics.conversion && (
                    <div className="px-3 py-1 bg-[#00ffcc]/5 border border-[#00ffcc]/20">
                      <div className="text-[#00ffcc] text-xs font-bold">{project.metrics.conversion}</div>
                      <div className="text-mono text-white/40 text-[8px]">CONVERSION</div>
                    </div>
                  )}
                </div>

                {/* Client testimonial snippet */}
                {project.testimonial && (
                  <div className="border-l-2 border-[#00ffcc]/30 pl-3 mb-4">
                    <p className="text-white/60 text-xs italic leading-relaxed">
                      "{project.testimonial.quote}"
                    </p>
                    <p className="text-mono text-white/40 text-[8px] mt-1">
                      — {project.testimonial.author}
                    </p>
                  </div>
                )}

                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-16 text-center reveal">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-10 py-4 border border-[#00ffcc]/30 text-[#00ffcc] text-mono text-[11px] tracking-wider hover:bg-[#00ffcc]/10 transition-all duration-300"
          >
            <span>VIEW ALL PROJECTS</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Right vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-mono text-white/20 text-[10px] tracking-[0.3em]">
          SHOWCASE
        </div>
      </div>
    </section>
  );
}
