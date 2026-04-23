"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'CYBERPUNK SHORT', category: 'MOTION DESIGN', img: '/projects/p1.jpg' },
  { id: 2, title: 'COFFEE BRAND', category: 'UGC ADS', img: '/projects/p2.jpg' },
  { id: 3, title: 'URBAN EXPLORE', category: 'CINEMATOGRAPHY', img: '/projects/p3.jpg' },
  { id: 4, title: 'GLITCH ART', category: 'EDITING', img: '/projects/p4.jpg' },
];

const FilmStripSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-300vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      pin.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#050508]">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-screen w-[400vw] flex flex-row relative items-center">
          {projects.map((project) => (
            <div key={project.id} className="h-screen w-screen flex justify-center items-center px-20">
              <div className="relative group w-full max-w-4xl aspect-video bg-zinc-900 overflow-hidden pixel-box">
                {/* Film Perforations */}
                <div className="absolute top-0 left-0 right-0 h-12 flex justify-between px-4 items-center z-10">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-[#050508] rounded-sm" />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 flex justify-between px-4 items-center z-10">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-[#050508] rounded-sm" />
                  ))}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/10 transition-colors duration-500 flex flex-col justify-center items-center">
                  <span className="text-[10px] text-teal-400 font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    SCENE 0{project.id} // {project.category}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-bold text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {project.title}
                  </h3>
                  <button className="mt-8 pixel-btn opacity-0 group-hover:opacity-100">
                    Play Scene
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmStripSection;
