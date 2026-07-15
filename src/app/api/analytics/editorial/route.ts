import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Settings, { type LeanSettings } from "@/models/Settings";
import { toPlainText } from "@/lib/text";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      featuredProjects,
      recentProjects,
      lastUpdatedProject,
    ] = await Promise.all([
      Project.countDocuments({}),
      Project.countDocuments({ status: "published" }),
      Project.countDocuments({ status: "draft" }),
      Project.countDocuments({ status: "published", featured: true }),
      Project.find({})
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title status featured updatedAt")
        .lean() as unknown as Array<{ _id: unknown; title: string; status: string; featured: boolean; updatedAt: Date }>,
      Project.findOne({ status: "published" })
        .sort({ publishedAt: -1 })
        .select("title publishedAt")
        .lean() as unknown as { _id: unknown; title: string; publishedAt: Date } | null,
    ]);

    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    const heroStatus = settings?.hero?.status || "draft";
    const contentStatus = settings?.siteContent?.status || "draft";
    const lastPublishedContent = settings?.siteContent?.publishedAt 
      ? new Date(settings.siteContent.publishedAt) 
      : null;
    const lastPublishedHero = settings?.hero?.publishedAt 
      ? new Date(settings.hero.publishedAt) 
      : null;

    const recentUpdates = recentProjects.slice(0, 3);

    return NextResponse.json({
      projects: {
        total: totalProjects,
        published: publishedProjects,
        draft: draftProjects,
        featured: featuredProjects,
      },
      content: {
        hero: {
          status: heroStatus,
          lastPublished: lastPublishedHero,
        },
        siteContent: {
          status: contentStatus,
          lastPublished: lastPublishedContent,
        },
      },
      recentProjects: recentProjects.map((p: { _id: unknown; title: string; status: string; featured: boolean; updatedAt: Date }) => ({
        _id: p._id,
        title: toPlainText(p.title) || "Untitled",
        status: p.status,
        featured: p.featured,
        updatedAt: p.updatedAt,
      })),
      lastPublishedProject: lastUpdatedProject ? {
        title: toPlainText(lastUpdatedProject.title) || "Untitled",
        publishedAt: lastUpdatedProject.publishedAt,
      } : null,
      recentUpdates: recentUpdates.map((p: { _id: unknown; title: string; status: string; updatedAt: Date }) => ({
        _id: p._id,
        title: toPlainText(p.title) || "Untitled",
        status: p.status,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error("EDITORIAL_INSIGHTS_ERROR:", error);
    return NextResponse.json({
      projects: { total: 0, published: 0, draft: 0, featured: 0 },
      content: {
        hero: { status: "unknown", lastPublished: null },
        siteContent: { status: "unknown", lastPublished: null },
      },
      recentProjects: [],
      lastPublishedProject: null,
      recentUpdates: [],
    });
  }
}