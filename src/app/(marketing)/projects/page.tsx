import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getPublicProjects } from "@/lib/projects/public-projects";
import { ProjectsClient } from "./ProjectsClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of cinematic case studies in creative direction, video production, motion design, and brand storytelling.",
  openGraph: {
    title: "Projects | Amr Yousry",
    description:
      "A selection of cinematic case studies in creative direction, video production, motion design, and brand storytelling.",
    url: "https://amr-yousry-portfolio.vercel.app/projects",
    siteName: "Amr Yousry Portfolio",
    images: [
      {
        url: "/images/meta/og-preview-v6.jpg",
        width: 1200,
        height: 630,
        alt: "Projects | Amr Yousry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Amr Yousry",
    description:
      "A selection of cinematic case studies in creative direction, video production, motion design, and brand storytelling.",
    images: ["/images/meta/og-preview-v6.jpg"],
  },
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <Section className="min-h-screen py-24 md:py-32 bg-background overflow-hidden">
      <Container>
        <ProjectsClient projects={projects} />
      </Container>
    </Section>
  );
}
