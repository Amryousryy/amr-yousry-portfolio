"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    year: "2024 - Present",
    title: "Lead Developer",
    company: "Freelance",
    description: "Building innovative web applications and AI integrations for clients worldwide.",
    skills: ["Next.js", "React", "AI Integration"],
  },
  {
    year: "2023 - 2024",
    title: "Full-Stack Developer",
    company: "Tech Startup",
    description: "Developed multiple web applications for local and international clients.",
    skills: ["React", "Node.js", "PostgreSQL"],
  },
  {
    year: "2022 - 2023",
    title: "Frontend Developer",
    company: "Digital Agency",
    description: "Built responsive websites and collaborated with design teams.",
    skills: ["HTML/CSS", "JavaScript", "Figma"],
  },
  {
    year: "2021 - 2022",
    title: "Junior Developer",
    company: "Software House",
    description: "Started career building web applications and learning modern frameworks.",
    skills: ["React", "JavaScript", "WordPress"],
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const line = lineRef.current;
        if (line) {
          gsap.fromTo(line, 
            { height: "0%" },
            {
              height: "100%",
              scrollTrigger: {
                trigger: line,
                start: "top 60%",
                end: "bottom 60%",
                scrub: 1,
              },
              ease: "none"
            }
          );
        }

        gsap.from(".timeline-item", {
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
          },
          x: -40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out"
        });
      }, containerRef);

      return () => ctx.revert();
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="experience"
      className="py-32 bg-surface relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-accent text-sm uppercase tracking-widest mb-4 block">
            04 — Experience
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium">
            Career Journey
          </h2>
        </div>

        <div className="timeline relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2">
            <div 
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-accent origin-top"
              style={{ height: "0%" }}
            />
          </div>

          <div className="space-y-16">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                className="timeline-item relative flex flex-col md:flex-row gap-8"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="flex-1 md:text-right md:pr-12">
                  <div className="inline-flex items-center gap-2 text-accent mb-2">
                    <Calendar size={14} />
                    <span className="text-sm">{exp.year}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-1">{exp.title}</h3>
                  <p className="text-accent mb-4">{exp.company}</p>
                </div>

                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-accent rounded-full -translate-x-1/2 mt-1.5 z-10">
                  <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30" />
                </div>

                <div className="flex-1 md:pl-12">
                  <p className="text-muted mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 text-xs bg-background rounded-full text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}