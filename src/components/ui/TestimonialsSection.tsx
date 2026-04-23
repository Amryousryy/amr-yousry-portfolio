"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  project: string;
  avatar: string;
  projectLink: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Karim El-Sayed",
    role: "Marketing Director",
    company: "Nile Towers Real Estate",
    quote: "Amr delivered a 3-minute brand film for our new development that reached 2.4 million views in 72 hours. The quality was cinematic — felt like a movie trailer, not a real estate ad.",
    rating: 5,
    project: "Nile Towers Launch Campaign",
    avatar: "https://i.pravatar.cc/80?img=11",
    projectLink: "#project-1",
  },
  {
    id: "2",
    name: "Lina Mansour",
    role: "Brand Manager",
    company: "AlRawabi Food Group",
    quote: "Working with Amr on our Ramadan campaign was a game-changer. Every reel hit 6 figures. He understands both the creative AND the algorithm — rare combination.",
    rating: 5,
    project: "AlRawabi Ramadan Series",
    avatar: "https://i.pravatar.cc/80?img=47",
    projectLink: "#project-2",
  },
  {
    id: "3",
    name: "Omar Khalil",
    role: "CEO & Co-Founder",
    company: "Mawjood Tech",
    quote: "The explainer video Amr made for our pitch deck was a crucial part of why investors said yes. Clean, clear, and beautifully animated. We raised $500K.",
    rating: 5,
    project: "Mawjood App Explainer",
    avatar: "https://i.pravatar.cc/80?img=33",
    projectLink: "#project-6",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(3).fill(false));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current?.querySelector(".section-header") as HTMLElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          opacity: 0,
          y: 60,
          rotation: i % 2 === 0 ? -3 : 3,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            onEnter: () => setVisibleCards((prev) => {
              const newState = [...prev];
              newState[i] = true;
              return newState;
            }),
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#050508] py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffcc] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffd700] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="section-header text-center mb-16">
          <div className="pixel-badge mb-4 mx-auto inline-flex">
            <span>CLIENT LOVE</span>
          </div>
          <h2 className="font-sora text-4xl md:text-5xl text-white mb-4">
            What They Say
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Don&apos;t take my word for it. Here&apos;s what clients have to say about working together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`pixel-box bg-[#0a0a0f] p-6 transition-all duration-500 ${
                visibleCards[i]
                  ? "opacity-100 translate-y-0 rotate-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transform: visibleCards[i]
                  ? `translateY(0) rotate(${i % 2 === 0 ? -1 : 1}deg)`
                  : `translateY(40px) rotate(${i % 2 === 0 ? -5 : 5}deg)`,
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span key={j} className="text-[#ffd700] text-lg" aria-label="5 stars">★</span>
                ))}
              </div>

              <blockquote className="text-white text-sm mb-4 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              <a
                href={testimonial.projectLink}
                className="pixel-text text-[#00ffcc] text-xs mb-4 block hover:text-white transition-colors"
              >
                PROJECT: {testimonial.project}
              </a>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <div className="text-white font-sora">{testimonial.name}</div>
                  <div className="text-white/50 text-sm">{testimonial.role}</div>
                  <div className="text-white/50 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="pixel-box bg-[#0a0a0f] inline-block px-8 py-4">
            <div className="pixel-text text-[#00ffcc] text-xs mb-2">SOCIAL PROOF</div>
            <div className="flex items-center gap-8">
              <div>
                <div className="font-sora text-3xl text-white font-bold">100%</div>
                <div className="pixel-text text-white/50 text-xs">Client Satisfaction</div>
              </div>
              <div className="w-px h-12 bg-[#1a1a2e]" />
              <div>
                <div className="font-sora text-3xl text-white font-bold">4.9/5</div>
                <div className="pixel-text text-white/50 text-xs">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-[#1a1a2e]" />
              <div>
                <div className="font-sora text-3xl text-white font-bold">85%</div>
                <div className="pixel-text text-white/50 text-xs">Return Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}