"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FilmReelAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !reelRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });

      tl.to(reelRef.current, {
        rotation: 360 * 3,
        ease: "none",
      })
      .from(textRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
      }, 0.5);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen bg-[#050508] flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0 relative">
            <div
              ref={reelRef}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-[#1a1a2e] relative overflow-hidden"
              style={{ 
                background: `repeating-conic-gradient(
                  from 0deg,
                  #0a0a0f 0deg 15deg,
                  #1a1a2e 15deg 30deg
                )`,
              }}
            >
              <div className="absolute inset-8 rounded-full bg-[#050508] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#00ffcc]/20 flex items-center justify-center">
                  <span className="pixel-text text-[#00ffcc] text-xs">PLAY</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#1a1a2e]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#1a1a2e]" />
            </div>
            
            <div className="absolute -top-4 -right-4 w-8 h-24 bg-[#1a1a2e] rounded-full animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute -bottom-4 -left-4 w-8 h-24 bg-[#1a1a2e] rounded-full animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
          </div>
          
          <div ref={textRef} className="flex-1 space-y-6">
            <div className="pixel-text text-[#00ffcc] text-sm">ABOUT ME</div>
            <h2 className="font-sora text-4xl md:text-5xl text-white">
              Crafting Stories <br />
              <span className="text-[#00ffcc]">Frame by Frame</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              With over 3 years of experience in video editing and motion design, 
              I specialize in transforming raw footage into compelling visual narratives. 
              From commercial campaigns to creative content, every project is an opportunity 
              to tell a story that resonates.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="pixel-border bg-[#0a0a0f] px-6 py-4">
                <div className="pixel-text text-[#00ffcc] text-xs mb-2">SKILLS</div>
                <div className="flex flex-wrap gap-2">
                  {["Premiere Pro", "After Effects", "DaVinci", "Cinema 4D"].map((skill) => (
                    <span key={skill} className="text-white text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <button className="pixel-border bg-[#00ffcc]/10 text-[#00ffcc] px-6 py-3 font-vt323 text-lg hover:bg-[#00ffcc]/20 transition-colors">
                CONTACT ME
              </button>
              <button className="bg-[#00ffcc] text-[#050508] px-6 py-3 font-vt323 text-lg hover:bg-[#00ffcc]/90 transition-colors">
                RESUME
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}