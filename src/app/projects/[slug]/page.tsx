import { notFound } from "next/navigation";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/projects";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = CASE_STUDIES.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const currentIndex = CASE_STUDIES.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
  const nextProject =
    currentIndex < CASE_STUDIES.length - 1 ? CASE_STUDIES[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#050508]">
      {/* FRAME 01: HERO */}
      <section data-frame="01" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/70 via-[#050508]/50 to-[#050508]" />

        <div className="relative z-10 container mx-auto px-6 text-center section-padding">
          <div className="frame-number mb-4">{`FRAME 01: HERO`}</div>
          <div className="frame-divider" />
          <div className="text-mono text-[#00ffcc]/60 text-[11px] tracking-[0.3em] mb-4">
            {project.category} • {project.year}
          </div>
          <h1 className="text-hero font-black text-white mb-6 tracking-tighter">
            {project.title}
          </h1>
          <div className="text-display text-[#00ffcc] mb-8">{project.client}</div>

          {/* Strategic Summary */}
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {project.strategicSummary}
          </p>
        </div>
      </section>

      {/* FRAME 02: PROOF METRICS */}
      <section data-frame="02" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="frame-number mb-4 text-center">FRAME 02: PROOF</div>
          <div className="frame-divider" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {project.metrics.map((metric, i) => (
              <div key={i} className="bg-[#0a0a0f] p-6 text-center border border-white/5">
                <div className="text-hero text-[#00ffcc] font-black mb-2">{metric.value}</div>
                <div className="text-mono text-white/80 text-[10px] tracking-[0.15em] mb-1">
                  {metric.label}
                </div>
                <div className="text-mono text-white/30 text-[9px]">{metric.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAME 03: CHALLENGE & APPROACH */}
      <section data-frame="03" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="frame-number mb-4">FRAME 03: STRATEGY</div>
          <div className="frame-divider" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-section text-white mb-6">
                <span className="frame-label">CHALLENGE</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h2 className="text-section text-white mb-6">
                <span className="frame-label">APPROACH</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">{project.approach}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FRAME 04: DELIVERABLES */}
      <section data-frame="04" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="frame-number mb-4">FRAME 04: DELIVERABLES</div>
          <div className="frame-divider" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.deliverables.map((item, i) => (
              <div
                key={i}
                className="bg-[#0a0a0f] p-6 border border-white/5 hover:border-[#00ffcc]/20 transition-colors duration-300"
              >
                <div className="text-[#00ffcc] text-[10px] mr-3">◆</div>
                <div className="text-white/70 text-sm">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAME 05: OUTCOME */}
      <section data-frame="05" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="frame-number mb-4">FRAME 05: OUTCOME</div>
          <div className="frame-divider" />
          <div className="max-w-4xl mx-auto">
            <p className="text-display text-white/80 leading-relaxed">{project.outcome}</p>
          </div>
        </div>
      </section>

      {/* FRAME 06: TESTIMONIAL */}
      <section data-frame="06" className="section-padding">
        <div className="container mx-auto px-6">
          <div className="frame-number mb-4 text-center">FRAME 06: TESTIMONIAL</div>
          <div className="frame-divider" />
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-display text-white/80 italic leading-relaxed mb-8">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-[#00ffcc] text-sm font-bold">{project.testimonial.author}</div>
            <div className="text-mono text-white/40 text-[10px] tracking-[0.15em] mt-1">
              {project.testimonial.role}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY - Large media blocks */}
      {project.gallery && (
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="frame-number mb-4 text-center">GALLERY</div>
            <div className="frame-divider" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((img, i) => (
                <div key={i} className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NAVIGATION + CTA */}
      <section className="section-padding border-t border-white/5">
        <div className="container mx-auto px-6">
          {/* CTA Hierarchy */}
          <div className="text-center mb-12">
            <h3 className="text-section text-white mb-6">
              Ready to turn your <span className="text-[#00ffcc]">multimedia into growth?</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {/* Primary CTA */}
              <Link
                href="/contact"
                className="pixel-button-primary"
              >
                Get a Quote
              </Link>

              {/* Secondary CTA */}
              <a
                href="https://calendly.com/your-link"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button-secondary"
              >
                Book Free Strategy Call
              </a>
            </div>

            {/* Tertiary CTA */}
            <div className="mb-8">
              <Link
                href="/projects"
                className="text-[#00ffcc]/60 text-[11px] uppercase tracking-[0.15em] hover:text-[#00ffcc] transition-colors"
              >
                View My Work
              </Link>
            </div>

            {/* Email Fallback */}
            <p className="text-foreground/40 text-sm">
              Prefer email?{" "}
              <a href="mailto:amr@amryousry.com" className="text-[#00ffcc] hover:underline">
                amr@amryousry.com
              </a>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { value: "50M+", label: "Views", context: "Across campaigns" },
              { value: "3.5X", label: "Avg ROI", context: "Increase proven" },
              { value: "100+", label: "Brands", context: "Scaled to 6 figs" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0f] p-6 border border-white/5">
                <div className="text-hero text-[#00ffcc] font-black mb-1">{stat.value}</div>
                <div className="text-mono text-white/80 text-[10px] tracking-[0.15em] mb-1">{stat.label}</div>
                <div className="text-mono text-white/30 text-[8px]">{stat.context}</div>
              </div>
            ))}
          </div>

          {/* Previous/Next Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5">
            {prevProject && (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="text-left hover:text-[#00ffcc] transition-colors"
              >
                <div className="frame-number text-[10px] mb-2">PREVIOUS</div>
                <div className="text-white/60">{prevProject.title}</div>
              </Link>
            )}
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="text-right hover:text-[#00ffcc] transition-colors"
              >
                <div className="frame-number text-[10px] mb-2">NEXT</div>
                <div className="text-white/60">{nextProject.title}</div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((project) => ({
    slug: project.slug,
  }));
}
