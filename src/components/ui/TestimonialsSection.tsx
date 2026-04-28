"use client";

import { useRef, useEffect } from "react";
import { animate, stagger, onScroll } from "animejs";

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
  const hasAnimatedRef = useRef(false);
  const observerRef = useRef<ReturnType<typeof onScroll> | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    observerRef.current = onScroll({
      target: sectionRef.current,
      enter: "top 70%",
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const header = sectionRef.current?.querySelector(".section-header") as HTMLElement;
        if (header) {
          animate(header, {
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            ease: "outQuint",
          });
        }

        const validCards = cardsRef.current.filter(Boolean) as HTMLElement[];
        animate(validCards, {
          opacity: [0, 1],
          translateY: [60, 0],
          rotate: (el, i) => [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? -1 : 1],
          delay: stagger(150),
          duration: 800,
          ease: "outQuint",
        });
      },
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.revert();
      }
    };
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
              className="pixel-box bg-[#0a0a0f] p-6 opacity-0 translate-y-10"
              style={{
                transform: `translateY(40px) rotate(${i % 2 === 0 ? -5 : 5}deg)`,
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
