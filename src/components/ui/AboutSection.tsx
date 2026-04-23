"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "Premiere Pro", level: 95 },
  { name: "After Effects", level: 88 },
  { name: "DaVinci Resolve", level: 82 },
  { name: "Cinema 4D", level: 70 },
  { name: "Photoshop", level: 85 },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reelRef.current) {
        gsap.to(reelRef.current, {
          rotation: 360 * 3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        });
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.6,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 70%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#050508] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-shrink-0 relative">
            <div
              ref={reelRef}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full relative"
              style={{
                background: `repeating-conic-gradient(
                  from 0deg,
                  #0a0a0f 0deg 15deg,
                  #1a1a2e 15deg 30deg
                )`,
              }}
            >
              <div className="absolute inset-8 rounded-full bg-[#050508] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#00ffcc]/20 flex items-center justify-center">
                  <span className="pixel-text text-[#00ffcc] text-xs">PLAY</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1a1a2e]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1a1a2e]" />
            </div>
            
            <div className="absolute -top-6 -right-6 w-10 h-20 bg-[#1a1a2e] rounded-full animate-spin" style={{ animationDuration: "4s" }} />
            <div className="absolute -bottom-6 -left-6 w-10 h-20 bg-[#1a1a2e] rounded-full animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }} />
          </div>
          
          <div ref={contentRef} className="flex-1 space-y-8">
            <div>
              <div className="pixel-text text-[#00ffcc] text-sm mb-2">ABOUT ME</div>
              <h2 className="font-sora text-4xl md:text-5xl text-white mb-4">
                Crafting Stories <br />
                <span className="text-[#00ffcc]">Frame by Frame</span>
              </h2>
            </div>
            
            <p className="text-white/70 text-lg leading-relaxed">
              With over 3 years of experience in video production and post-production, 
              I specialize in transforming ideas into compelling visual narratives. 
              From concept to final cut, I bring creativity, technical expertise, 
              and a keen eye for detail to every project.
            </p>
            
            <div className="pixel-box bg-[#0a0a0f] p-6">
              <div className="pixel-text text-[#00ffcc] text-xs mb-4">SKILLS</div>
              <div className="space-y-4">
                {SKILLS.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm">{skill.name}</span>
                      <span className="pixel-text text-[#00ffcc] text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a2e]">
                      <div
                        className="h-full bg-[#00ffcc] transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="pixel-btn">
                DOWNLOAD CV
              </button>
              <button className="pixel-btn-outline">
                VIEW PROJECTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}