import { Metadata } from "next";
import { ProjectService } from "@/lib/api-client";
import ProjectArchiveClient from "@/components/sections/ProjectArchiveClient";

export const metadata: Metadata = {
  title: "Gallery | Amr Yousry Archive",
  description: "Explore the archive of high-end real estate and UGC content by Amr Yousry.",
};

export default async function ProjectsPage() {
  // Pre-fetch projects on the server for SEO and speed
  const { data: projects = [] } = await ProjectService.getAll();

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <ProjectArchiveClient initialProjects={projects} />
      </div>
    </div>
  );
}
