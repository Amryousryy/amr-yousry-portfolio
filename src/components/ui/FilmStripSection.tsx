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
  year: string;
  duration: string;
  badge?: string;
  thumbnail: string;
}

const PROJECT_CASES: ProjectCase[] = [
  {
    id: "1",
    client: "Nile Towers Real Estate",
    type: "Brand Film",
    title: "Nile Towers — Launch Campaign",
    description: "A cinematic launch film for one of Cairo's most prestigious real estate developments. Shot across 3 days featuring drone footage, lifestyle sequences, and motion graphics.",
    results: "2.4M views in 72 hours",
    views: "2.4M",
    year: "2025",
    duration: "2:30 min",
    badge: "★ DIRECTOR'S PICK",
    thumbnail: "https://picsum.photos/seed/realestate1/800/500",
  },
  {
    id: "2",
    client: "AlRawabi Food Group",
    type: "Social Content",
    title: "AlRawabi — Ramadan Series Promos",
    description: "Fast-paced Ramadan promotional content series for one of Saudi Arabia's leading food brands. Included motion typography, product reveals, and cultural storytelling.",
    results: "12 reels avg 180K views each",
    views: "2.1M",
    year: "2025",
    duration: "15–30s reels",
    thumbnail: "https://picsum.photos/seed/food2ramadan/800/500",
  },
  {
    id: "3",
    client: "DriveX Car Rental",
    type: "Commercial",
    title: "DriveX — Brand Identity Film",
    description: "A high-energy brand identity film showcasing DriveX's premium fleet. Cinematic car shots combined with sleek motion graphics and a driving soundtrack.",
    results: "+40% bookings increase",
    views: "850K",
    year: "2024",
    duration: "1:00 min",
    thumbnail: "https://picsum.photos/seed/cardriveX/800/500",
  },
  {
    id: "4",
    client: "TechPulse Egypt",
    type: "Motion Design",
    title: "TechPulse — Product Launch Reel",
    description: "Kinetic typography and product motion reel for the launch of TechPulse's new smartphone line in the Egyptian market. Designed for vertical and horizontal formats.",
    results: "500K+ TikTok views in 48hrs",
    views: "500K",
    year: "2025",
    duration: "45s",
    thumbnail: "https://picsum.photos/seed/techpulse4/800/500",
  },
  {
    id: "5",
    client: "North Coast Tourism Board",
    type: "Brand Film",
    title: "Sahel Summer — Tourism Campaign",
    description: "A dreamy summer campaign film for Egypt's North Coast tourism season. Golden hour cinematography, lifestyle footage, and color grading to evoke summer nostalgia.",
    results: "Featured in 3 Egyptian media outlets",
    views: "1.2M",
    year: "2024",
    duration: "3:00 min",
    thumbnail: "https://picsum.photos/seed/sahelfilm5/800/500",
  },
  {
    id: "6",
    client: "Mawjood Tech Startup",
    type: "Motion Design",
    title: "Mawjood App — Explainer Animation",
    description: "A clean 2D explainer animation for Mawjood, an Egyptian attendance management app. Designed the full storyboard, character animation, and motion UI sequences.",
    results: "Used in $500K funding pitch",
    views: "200K",
    year: "2024",
    duration: "90s",
    thumbnail: "https://picsum.photos/seed/mawjoodapp6/800/500",
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
        {PROJECT_CASES.map((project) => (
          <div
            key={project.id}
            data-project
            id={`project-${project.id}`}
            className="case-study-card flex-shrink-0 w-[480px] bg-[#0a0a0f] border-2 border-[#1a1a2e] relative group cursor-pointer overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={project.thumbnail}
                alt={`${project.title} - ${project.client}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              {project.badge && (
                <div className="absolute top-3 left-3">
                  <span className="pixel-text text-[#ffd700] text-xs bg-[#ffd700]/20 px-2 py-1">
                    {project.badge}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full border-2 border-[#00ffcc] bg-[#00ffcc]/20 flex items-center justify-center">
                  <span className="text-[#00ffcc] text-3xl">▶</span>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className="pixel-text text-[#00ffcc] text-xs bg-[#00ffcc]/20 px-2 py-1">
                  {project.views} VIEWS
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="pixel-text text-white/70 text-xs">{project.year}</span>
                <span className="pixel-text text-white/50 text-xs mx-2">•</span>
                <span className="pixel-text text-white/70 text-xs">{project.duration}</span>
              </div>
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
              <p className="text-white/60 text-sm leading-relaxed">{project.description}</p>
              <div className="pixel-box bg-[#00ffcc]/10 p-3 mt-2">
                <div className="pixel-text text-[#00ffcc] text-xs mb-1">RESULTS</div>
                <div className="text-white font-sora text-sm">{project.results}</div>
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