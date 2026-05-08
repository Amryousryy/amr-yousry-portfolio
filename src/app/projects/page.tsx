import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getAllProjects } from "@/data/projects";
import { ProjectsClient } from "./ProjectsClient";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Section className="min-h-screen py-32 bg-background">
      <Container>
        <ProjectsClient projects={projects} />
      </Container>
    </Section>
  );
}
