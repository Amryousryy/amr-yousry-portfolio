import Image from "next/image";
import type { Project } from "@/types/project-static";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ExternalLink } from "lucide-react";
import { getMediaKind, getEmbeddableVideoUrl, getMediaProvider } from "@/lib/media/config";
import { formatCategory } from "@/lib/projects/categories";
import { CaseStudyClient } from "@/app/(marketing)/projects/[slug]/CaseStudyClient";
import type { RelatedProjectItem } from "@/lib/projects/case-study";

/**
 * THE single visual implementation of a project case-study page.
 *
 * Used by BOTH the public /projects/[slug] page and the admin draft preview
 * (/preview/project/[id]). A preview therefore renders pixel-identical output
 * to the live page — including hero, hero media, and the whole case-study
 * body — while `trackView={false}` prevents admin previews from inflating
 * public project view counts.
 *
 * Guarding: published projects always carry a banner image, so the Image
 * fallback/placeholder branch below is only reachable for draft shells with no
 * media yet — it prevents an `<Image src="">` crash on the preview route.
 */

function firstSentence(text: string): string {
  const parts = text.split(/[.!?]/).filter((s) => s.trim().length > 0);
  return parts.length > 0 ? parts[0].trim() + "." : text;
}

interface ProjectCaseStudyProps {
  project: Project;
  relatedProjects: RelatedProjectItem[];
  trackView?: boolean;
}

export function ProjectCaseStudy({
  project,
  relatedProjects,
  trackView = true,
}: ProjectCaseStudyProps) {
  const heroStatement = project.outcomeNarrative
    ? firstSentence(project.outcomeNarrative)
    : project.mainResult || project.summary;

  const hasImage = !!project.bannerImage;
  const hv = project.heroVideo;

  return (
    <Section className="min-h-screen bg-background overflow-hidden">
      {/* HERO — metadata first, media below */}
      <Container>
        <div className="pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-10 md:pb-14">
          <span className="font-pixel text-brand-cyan text-[10px] sm:text-sm tracking-widest uppercase mb-4 block">
            {formatCategory(project.category)}
          </span>
          <h1
            className="text-[clamp(1.75rem,6.5vw,3.5rem)] md:text-6xl lg:text-7xl font-display font-bold uppercase tracking-tighter break-words leading-tight"
            style={{ textWrap: "balance", maxWidth: "16ch" }}
          >
            {project.title}
          </h1>
          {heroStatement && (
            <p
              className="font-modern text-xl md:text-2xl text-white leading-[1.4] max-w-[680px] mt-6 mb-5"
              style={{ textWrap: "balance" }}
            >
              {heroStatement}
            </p>
          )}
          <p
            className="font-modern text-sm sm:text-base text-foreground/60 max-w-[600px] leading-relaxed"
            style={{ textWrap: "balance" }}
          >
            {project.summary}
          </p>
        </div>
      </Container>

      {/* HERO MEDIA */}
      <div className="relative h-[40vh] sm:h-[56vh] md:h-[64vh] min-h-[280px] sm:min-h-[400px] overflow-hidden">
        {(() => {
          if (!hv) {
            if (!hasImage) {
              // Draft shell with no media yet — show a neutral placeholder so
              // `<Image src="">` can never be rendered on the preview route.
              return (
                <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center gap-2">
                  <span className="font-pixel text-[10px] uppercase tracking-widest text-foreground/60">
                    No banner media set
                  </span>
                  <span className="font-modern text-xs text-foreground/40">
                    This preview will update once a banner image or video is added.
                  </span>
                </div>
              );
            }
            return (
              <Image
                src={project.bannerImage}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            );
          }
          const kind = getMediaKind(hv);
          const embedUrl = getEmbeddableVideoUrl(hv);
          const provider = getMediaProvider(hv);
          if (kind === "embed" && embedUrl) {
            return (
              <div className="absolute inset-0">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }
          if (kind === "video") {
            return (
              <div className="absolute inset-0">
                <video src={hv} controls playsInline className="w-full h-full object-cover" />
              </div>
            );
          }
          if (kind === "external" || kind === "embed") {
            return (
              <a
                href={hv}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-accent/5 hover:bg-accent/10 transition-colors group"
              >
                <ExternalLink size={32} className="text-accent/60 group-hover:text-accent" />
                <span className="font-bold text-xs uppercase tracking-widest text-accent">
                  Open {provider || "external video"}
                </span>
              </a>
            );
          }
          return hasImage ? (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-primary/10" />
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>

      <Container>
        <CaseStudyClient
          trackView={trackView}
          project={{
            problem: project.problem,
            solution: project.solution,
            execution: project.execution,
            mainResult: project.mainResult,
            outcomeNarrative: project.outcomeNarrative,
            detailedResults: project.detailedResults,
            keyDecisions: project.keyDecisions,
            quickFacts: project.quickFacts,
            beforeAfter: project.beforeAfter,
            socialProof: project.socialProof,
            services: project.services || [],
            media: project.media,
            title: project.title,
          }}
          relatedProjects={relatedProjects}
        />
      </Container>
    </Section>
  );
}