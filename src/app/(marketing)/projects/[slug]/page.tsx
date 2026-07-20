import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getProjectBySlug, getPublicProjects } from "@/lib/projects/public-projects";
import { getMediaKind, getEmbeddableVideoUrl, getMediaProvider } from "@/lib/media/config";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatCategory } from "@/lib/projects/categories";
import { CaseStudyClient } from "./CaseStudyClient";

export const revalidate = 60;

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  const seoTitle = project.seo?.title || project.title;
  const seoDescription = project.seo?.description || project.summary || `${project.title} — A project by Amr Yousry.`;
  const title = seoTitle;
  const ogTitle = `${seoTitle} | Amr Yousry Portfolio`;
  const url = `https://amr-yousry-portfolio.vercel.app/projects/${slug}`;
  const imageUrl = project.bannerImage || project.thumbnail || "/images/meta/og-preview-v6.jpg";
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `https://amr-yousry-portfolio.vercel.app${imageUrl}`;

  return {
    title,
    description: seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: seoDescription,
      url,
      siteName: "Amr Yousry Portfolio",
      images: [{ url: absoluteImageUrl, width: 1200, height: 630, alt: ogTitle }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoDescription,
      images: [absoluteImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

function firstSentence(text: string): string {
  const parts = text.split(/[.!?]/).filter((s) => s.trim().length > 0);
  return parts.length > 0 ? parts[0].trim() + "." : text;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  const allProjects = await getPublicProjects();
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const heroStatement = project.outcomeNarrative
    ? firstSentence(project.outcomeNarrative)
    : (project.mainResult || project.summary);

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
          const hv = project.heroVideo;
          if (!hv) {
            return (
              <Image
                src={project.bannerImage}
                alt={project.title}
                fill
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
          return (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>

      <Container>
        <CaseStudyClient
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
          relatedProjects={relatedProjects.map((p) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            thumbnail: p.thumbnail,
            summary: p.summary,
          }))}
        />
      </Container>
    </Section>
  );
}
