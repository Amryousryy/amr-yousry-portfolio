import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getPublicProjects } from "@/lib/projects/public-projects";
import { ProjectsClient } from "./ProjectsClient";

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
