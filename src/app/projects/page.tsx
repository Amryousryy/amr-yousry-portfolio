import { Metadata } from "next";
import { ProjectService } from "@/lib/api-client";
import ProjectArchiveClient from "@/components/sections/ProjectArchiveClient";

export const metadata: Metadata = {
  title: "Gallery | Amr Yousry Archive",
  description: "Explore the archive of high-end real estate and UGC content by Amr Yousry.",
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  try {
    const { data: projects = [] } = await ProjectService.getAll();
    const safeProjects = Array.isArray(projects) ? projects : [];

    return (
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-6">
          <ProjectArchiveClient initialProjects={safeProjects} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("ProjectsPage error:", error);
    return (
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center py-40">
            <p className="text-foreground/50">Unable to load projects at this time.</p>
          </div>
        </div>
      </div>
    );
  }
}
