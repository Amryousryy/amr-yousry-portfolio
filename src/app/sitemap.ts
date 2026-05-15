import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/projects/public-projects";

const BASE_URL = "https://amr-yousry-portfolio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

  ];

  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const projects = await getPublicProjects();
    projectEntries = projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // Fallback: return static entries only if DB fails
  }

  return [...staticEntries, ...projectEntries];
}
