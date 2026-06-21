"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/types/project-static";
import type { PublicContactContent } from "@/lib/contact-content-normalizer";

const ProjectsSection = dynamic(() => import("@/components/sections/projects"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/sections/about"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sections/contact"), { ssr: false });

interface ClientDynamicSectionsProps {
  projects: Project[];
  contactData?: PublicContactContent;
}

export default function ClientDynamicSections({ projects, contactData }: ClientDynamicSectionsProps) {
  return (
    <>
      <ProjectsSection projects={projects} />
      <AboutSection />
      <ContactSection contactData={contactData} />
    </>
  );
}
