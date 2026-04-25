"use client";

import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, ArrowRight } from "lucide-react";
import { TestimonialService } from "@/lib/api-client";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  _id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  projectSlug?: string;
  rating: number;
  isFeatured: boolean;
}

const EMPTY_TESTIMONIALS: TestimonialData[] = [];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => TestimonialService.getAll(false),
  });

  const testimonials = testimonialsData?.data || EMPTY_TESTIMONIALS;

  useEffect(() => {
    if (!sectionRef.current || testimonials.length === 0) return;

    if (visibleCards.length !== testimonials.length) {
      setVisibleCards(new Array(testimonials.length).fill(false));
    }

    const ctx = gsap.context(() => {
      gsap.from(".section-header", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: i * 0.1,
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
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 bg-[#050508]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 animate-pulse">
                <div className="h-8 w-8 bg-white/5 rounded mb-6" />
                <div className="h-4 bg-white/5 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-8" />
                <div className="pt-6 border-t border-white/5">
                  <div className="h-4 bg-white/5 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-[#050508] relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="section-header mb-16">
            <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              What Clients Say
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl">
              Client testimonials will appear here once added from the admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#050508] relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="section-header mb-16">
          <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Clients Say
          </h2>
          <p className="text-foreground/60 text-lg max-w-xl">
            Real feedback from projects delivered. Each testimonial relates to specific work completed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <div
              key={testimonial._id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`p-8 bg-zinc-900/30 border border-white/5 transition-all duration-500 ${
                visibleCards[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Quote className="w-8 h-8 text-accent/40 mb-6" />
              
              <blockquote className="text-foreground/80 text-base leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-foreground/50 text-sm">{testimonial.role}, {testimonial.company}</div>
                </div>
                {testimonial.projectSlug && (
                  <a 
                    href={`/projects/${testimonial.projectSlug}`}
                    className="flex items-center text-accent text-xs font-semibold hover:text-accent/80 transition-colors"
                  >
                    View Project
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">3+</div>
              <div className="text-foreground/50 text-sm">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-foreground/50 text-sm">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">30+</div>
              <div className="text-foreground/50 text-sm">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2</div>
              <div className="text-foreground/50 text-sm">Countries Reached</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}