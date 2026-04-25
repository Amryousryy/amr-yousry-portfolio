"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquare, FileText, Video, CheckCircle, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We discuss your goals, audience, and the story you want to tell. I ask the right questions to understand what success looks like for you.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Concept & Pre-Production",
    description: "I create a clear brief, mood board, and production plan. You review and approve the direction before any filming begins.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Production & Delivery",
    description: "I film or source footage, edit with precision, and deliver a polished final piece. Revisions are included until you're satisfied.",
    icon: Video,
  },
];

const SKILLS = [
  { name: "Video Editing (Premiere Pro / DaVinci)", level: 95 },
  { name: "Motion Graphics (After Effects)", level: 90 },
  { name: "Color Grading", level: 85 },
  { name: "Content Strategy", level: 88 },
  { name: "Brand Storytelling", level: 92 },
  { name: "Photography Direction", level: 80 },
];

const TOOLS = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Photoshop",
  "Illustrator",
  "Cinema 4D",
  "Figma",
  "CapCut",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          opacity: 0,
          y: 30,
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#050508]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border border-white/10">
                <img
                  src="https://i.pravatar.cc/300?img=69"
                  alt="Amr Yousry"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div ref={contentRef} className="flex-1 space-y-12">
              <div>
                <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">About</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Video content that<br />
                  <span className="text-accent">drives real results</span>
                </h2>
              </div>

              <div className="space-y-4 text-foreground/70 text-lg leading-relaxed">
                <p>
                  I help brands communicate clearly through video. Whether it&apos;s a brand film, social content, or a product explainer — I handle everything from concept to final cut.
                </p>
                <p>
                  Based in Cairo, working with clients across Egypt and Saudi Arabia. I focus on real estate, food & beverage, tech, and lifestyle brands.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#contact" className="px-8 py-4 bg-accent text-background font-bold text-sm">
                  Work With Me
                </a>
                <a href="#projects" className="px-8 py-4 border border-white/10 text-white font-medium text-sm hover:border-white/30 transition-colors">
                  View Work
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">The Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">How We Work Together</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-8 bg-zinc-900/30 border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-accent text-xs font-bold">{item.step}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="mb-6">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">Skills</span>
              <div className="space-y-4">
                {SKILLS.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">{skill.name}</span>
                      <span className="text-accent text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/5">
                      <div
                        className="h-full bg-accent transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-6 block">Tools I Use</span>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((tool, i) => (
                  <span key={i} className="px-4 py-2 bg-zinc-900/50 border border-white/5 text-foreground/70 text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-900/30 border border-white/5">
              <h4 className="text-lg font-bold text-white mb-4">Ready to start?</h4>
              <p className="text-foreground/60 mb-6">
                Every project starts with a conversation. Tell me about your goals and let&apos;s see if we&apos;re a good fit.
              </p>
              <a href="#contact" className="inline-flex items-center text-accent text-sm font-semibold hover:text-accent/80 transition-colors">
                Get in touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}