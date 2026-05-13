import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
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

  const title = `${project.title} | Amr Yousry Portfolio`;
  const description = project.summary || `${project.title} — A project by Amr Yousry.`;
  const url = `https://amr-yousry-portfolio.vercel.app/projects/${slug}`;
  const imageUrl = project.bannerImage || project.thumbnail || "https://amr-yousry-portfolio.vercel.app/images/meta/og-preview-v6.jpg";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Amr Yousry Portfolio",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  return (
    <Section className="min-h-screen py-24 md:py-32 bg-background overflow-hidden">
      {/* Hero Media */}
      <div className="relative h-[56vh] min-h-[420px] md:h-[60vh] mb-14 md:mb-20 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-16">
          <Container>
            <span className="font-pixel text-brand-cyan text-[10px] sm:text-sm tracking-widest uppercase mb-4 block">
              {formatCategory(project.category)}
            </span>
            <h1 className="text-[clamp(1.75rem,8vw,4rem)] md:text-6xl lg:text-7xl font-display font-bold uppercase tracking-tighter break-words leading-tight">
              {project.title}
            </h1>
          </Container>
        </div>
      </div>

      <Container>
        <CaseStudyClient project={{ ...project, slug }} />

        {/* Back CTA */}
        <div className="mt-20 pt-12 border-t border-slate-800 text-center">
          <Link href="/projects">
            <PixelButton variant="outline" className="px-8 py-3 text-sm">
              ← All Projects
            </PixelButton>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
