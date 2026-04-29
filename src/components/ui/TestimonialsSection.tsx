"use client";

import { useQuery } from "@tanstack/react-query";
import { Quote, ArrowRight } from "lucide-react";
import { TestimonialService } from "@/lib/api-client";

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
  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => TestimonialService.getAll(false),
  });

  const testimonials = testimonialsData?.data || EMPTY_TESTIMONIALS;

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

  return (
    <section className="py-24 md:py-32 bg-[#050508] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] opacity-10"
          style={{
            background: "radial-gradient(circle, #00ffcc 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16">
          <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Clients Say
          </h2>
          <p className="text-foreground/60 text-lg max-w-xl">
            Real feedback from projects delivered. Each testimonial relates to specific work completed.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-white/30 italic">No testimonials available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <div
                key={testimonial._id}
                className="p-8 bg-zinc-900/30 border border-white/5"
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
        )}

        <div className="mt-20 pt-16 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Years Experience", value: "3+" },
              { label: "Projects Completed", value: "50+" },
              { label: "Happy Clients", value: "30+" },
              { label: "Countries Reached", value: "2" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-foreground/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
