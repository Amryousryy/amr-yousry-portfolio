"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/types/project-static";

const ProjectsSection = dynamic(() => import("@/components/sections/projects"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/sections/about"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sections/contact"), { ssr: false });

export default function ClientDynamicSections({ projects }: { projects: Project[] }) {
  return (
    <>
      <ProjectsSection projects={projects} />
      <AboutSection />
      <ContactSection />
    </>
  );
}
