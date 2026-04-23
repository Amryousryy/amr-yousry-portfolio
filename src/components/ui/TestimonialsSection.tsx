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
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Hassan",
    role: "Marketing Director",
    company: "Nike Egypt",
    quote: "Amr transformed our product launch into a viral sensation. The attention to detail and creative vision exceeded all our expectations.",
    rating: 5,
    project: "Air Max Campaign",
  },
  {
    id: "2",
    name: "Mohamed Adel",
    role: "Brand Manager",
    company: "Spotify MENA",
    quote: "Working with Amr was seamless. He understood our brand voice and delivered content that resonated deeply with our audience.",
    rating: 5,
    project: "Wrapped Video",
  },
  {
    id: "3",
    name: "Layla Osman",
    role: "Creative Lead",
    company: "Tesla MENA",
    quote: "The production quality was exceptional. Every frame told our story beautifully. Our engagement rates tripled after the campaign.",
    rating: 5,
    project: "Model Y Reveal",
  },
  {
    id: "4",
    name: "Karim Mahmoud",
    role: "CEO",
    company: "Coca-Cola Egypt",
    quote: "Amr doesn't just edit videos — he crafts experiences. His work on our summer campaign drove the highest ROAS we've seen.",
    rating: 5,
    project: "Summer Campaign",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(4).fill(false));

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span key={j} className="text-[#ffd700] text-lg">★</span>
                ))}
              </div>

              <blockquote className="text-white text-lg mb-4 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              <div className="pixel-text text-[#00ffcc] text-xs mb-4">
                PROJECT: {testimonial.project}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ffcc] to-[#00ff88] flex items-center justify-center text-[#050508] font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-sora">{testimonial.name}</div>
                  <div className="text-white/50 text-sm">{testimonial.role}, {testimonial.company}</div>
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