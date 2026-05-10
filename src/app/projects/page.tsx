import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getAllProjects } from "@/data/projects";
import { ProjectsClient } from "./ProjectsClient";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Section className="min-h-screen py-24 md:py-32 bg-background overflow-hidden">
      <Container>
        <ProjectsClient projects={projects} />
      </Container>
    </Section>
  );
}
