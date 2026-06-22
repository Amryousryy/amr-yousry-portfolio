"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/types/project-static";
import type { PublicContactContent } from "@/lib/contact-content-normalizer";
import type { PublicAboutContent } from "@/lib/about-content-normalizer";

const ProjectsSection = dynamic(() => import("@/components/sections/projects"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/sections/about"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sections/contact"), { ssr: false });

interface ClientDynamicSectionsProps {
  projects: Project[];
  aboutData?: PublicAboutContent;
  contactData?: PublicContactContent;
}

export default function ClientDynamicSections({ projects, aboutData, contactData }: ClientDynamicSectionsProps) {
  return (
    <>
      <ProjectsSection projects={projects} />
      <AboutSection aboutData={aboutData} />
      <ContactSection contactData={contactData} />
    </>
  );
}
