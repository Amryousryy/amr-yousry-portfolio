import { Metadata } from "next";
import { ProjectService } from "@/lib/api-client";
import ProjectDetailClient from "@/components/sections/ProjectDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await ProjectService.getBySlug(slug);

  if (!project) return { title: "Archive Not Found" };

  return {
    title: `${project.title} | Amr Yousry Archive`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: project } = await ProjectService.getBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient slug={slug} initialData={project} />;
}
