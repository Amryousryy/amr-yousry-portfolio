import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import type { Project } from "@/types/project-static";
import Link from "next/link";
import ProjectsHeader from "./projects-header";
import ProjectsCards from "./projects-cards";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <Section id="projects" className="pt-14 md:pt-16 pb-16 md:pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/95 via-transparent to-surface/98 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none" />

      <Container>
        <div className="mb-8 md:mb-10">
          <div className="max-w-xl">
            <ProjectsHeader />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <ProjectsCards projects={projects} />
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/projects" className="w-full">
            <PixelButton variant="outline" className="w-full py-5 tracking-widest text-xs">
              View All Projects
            </PixelButton>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
