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
      <div data-reveal><ProjectsSection projects={projects} /></div>
      <div data-reveal><AboutSection aboutData={aboutData} /></div>
      <div data-reveal><ContactSection contactData={contactData} /></div>
    </>
  );
}
