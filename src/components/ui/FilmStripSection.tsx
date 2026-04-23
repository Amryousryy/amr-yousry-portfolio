"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCase {
  id: string;
  client: string;
  type: string;
  title: string;
  description: string;
  results: string;
  views: string;
  thumbnail: string;
}

const PROJECT_CASES: ProjectCase[] = [
  {
    id: "1",
    client: "Nike Egypt",
    type: "Brand Campaign",
    title: "Air Max Launch",
    description: "High-energy commercial showcasing the new Air Max 2024 collection",
    results: "+156% engagement",
    views: "500K+",
    thumbnail: "",
  },
  {
    id: "2",
    client: "Spotify MENA",
    type: "Music Video",
    title: "Wrapped 2024",
    description: "Animated explainer for Spotify's annual Wrapped feature",
    results: "+89% streams",
    views: "1.2M",
    thumbnail: "",
  },
  {
    id: "3",
    client: "Tesla MENA",
    type: "Product Launch",
    title: "Model Y Reveal",
    description: "Cinematic reveal event video with 3D animations",
    results: "50K+ leads",
    views: "2.1M",
    thumbnail: "",
  },
  {
    id: "4",
    client: "Coca-Cola",
    type: "Seasonal Campaign",
    title: "Summer Vibe",
    description: "Vibrant summer campaign with user-generated content integration",
    results: "+234% reach",
    views: "800K+",
    thumbnail: "",
  },
  {
    id: "5",
    client: "Adidas Originals",
    type: "Fashion Film",
    title: "Creator Series",
    description: "Documentary-style content featuring regional creators",
    results: "+67% brand lift",
    views: "450K+",
    thumbnail: "",
  },
  {
    id: "6",
    client: "Etisalat",
    type: "Corporate",
    title: "5G Launch",
    description: "Technical explainer with stunning visual effects",
    results: "10M+ impressions",
    views: "3.5M",
    thumbnail: "",
  },
];

export default function FilmStripSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="projects" ref={containerRef} className="h-screen overflow-hidden bg-[#050508]">
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0f] flex items-center px-4 z-10 border-b border-[#1a1a2e]">
        <div className="pixel-text text-[#00ffcc] text-xs mr-8">CASE STUDIES</div>
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
        {PROJECT_CASES.map((project, index) => (
          <div
            key={project.id}
            data-project
            className="case-study-card flex-shrink-0 w-[480px] bg-[#0a0a0f] border-2 border-[#1a1a2e] relative group cursor-pointer overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#00ffcc]/30 flex items-center justify-center group-hover:border-[#00ffcc] group-hover:scale-110 transition-all duration-300">
                  <span className="text-[#00ffcc]/50 group-hover:text-[#00ffcc] group-hover:opacity-100 text-3xl transition-all">▶</span>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className="pixel-text text-[#00ffcc] text-xs bg-[#00ffcc]/20 px-2 py-1">
                  {project.views} VIEWS
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="pixel-text text-white/50 text-xs">CLIENT:</span>
                <span className="text-white font-sora text-lg">{project.client}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="pixel-text text-white/50 text-xs">TYPE:</span>
                <span className="pixel-text text-[#00ffcc] text-xs">{project.type}</span>
              </div>
              <div className="h-px bg-[#1a1a2e] my-2" />
              <h3 className="font-sora text-xl text-white mb-1">{project.title}</h3>
              <p className="text-white/60 text-sm">{project.description}</p>
              <div className="pixel-box bg-[#00ffcc]/10 p-3 mt-2">
                <div className="pixel-text text-[#00ffcc] text-xs mb-1">RESULTS</div>
                <div className="text-white font-sora">{project.results}</div>
              </div>
            </div>

            <div className="absolute inset-0 border-2 border-[#00ffcc]/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <div className="pixel-box bg-[#0a0a0f]/90 p-4">
          <div className="pixel-text text-[#00ffcc] text-xs mb-2">6 PROJECTS</div>
          <div className="pixel-text text-white/50 text-xs">SCROLL TO EXPLORE</div>
        </div>
      </div>
    </section>
  );
}