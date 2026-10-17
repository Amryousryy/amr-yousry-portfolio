import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getPublicProjectSlugs } from "@/lib/projects/public-projects";
import { getCanonicalProjectSlug } from "@/lib/projects/canonical-slugs";
import { ProjectCaseStudy } from "@/components/public/ProjectCaseStudy";
import { getRelatedProjectItems } from "@/lib/projects/case-study";

export const revalidate = 60;

// Only slugs returned by generateStaticParams are served. Any other dynamic
// slug (unknown or stray) returns a true HTTP 404 instead of the empty shell /
// 200 soft-404 that on-demand ISR rendering otherwise produces for this route.
export const dynamicParams = false;

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  // Canonical URL must always reference the canonical project identity so old
  // inbound URLs (redirect sources) never become the canonical reference.
  const canonicalSlug = getCanonicalProjectSlug(slug);

  const seoTitle = project.seo?.title || project.title;
  const seoDescription = project.seo?.description || project.summary || `${project.title} — A project by Amr Yousry.`;
  const title = seoTitle;
  const ogTitle = `${seoTitle} | Amr Yousry Portfolio`;
  const url = `https://amryousry.com/projects/${canonicalSlug}`;
  const imageUrl = project.bannerImage || project.thumbnail || "/images/meta/og-preview-v6.jpg";
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `https://amryousry.com${imageUrl}`;

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
  const slugs = await getPublicProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  const relatedProjects = await getRelatedProjectItems(project);

  // Single shared visual implementation (hero, hero media, case-study body,
  // related grid) — identical markup to the admin draft preview route.
  return <ProjectCaseStudy project={project} relatedProjects={relatedProjects} />;
}
