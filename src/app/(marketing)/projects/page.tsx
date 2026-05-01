import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/sections/projects/project-card";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <Section>
      <Container>
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl mb-6">Archive.</h1>
          <p className="font-modern text-text-dim text-xl max-w-2xl">
            A comprehensive list of creative direction, cinematic stories, and high-converting campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
