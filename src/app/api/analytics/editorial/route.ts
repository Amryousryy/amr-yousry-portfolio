import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Settings from "@/models/Settings";

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
        .lean() as any,
      Project.findOne({ status: "published" })
        .sort({ publishedAt: -1 })
        .select("title publishedAt")
        .lean() as any,
    ]);

    const settings = await Settings.findOne({}).lean() as any;
    const heroStatus = settings?.hero?.status || "draft";
    const contentStatus = settings?.siteContent?.status || "draft";
    const lastPublishedContent = settings?.siteContent?.publishedAt 
      ? new Date(settings.siteContent.publishedAt) 
      : null;
    const lastPublishedHero = settings?.hero?.publishedAt 
      ? new Date(settings.hero.publishedAt) 
      : null;

    const recentUpdates = await Project.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("title status updatedAt")
      .lean() as any;

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
      recentProjects: recentProjects.map((p: any) => ({
        _id: p._id,
        title: p.title || "Untitled",
        status: p.status,
        featured: p.featured,
        updatedAt: p.updatedAt,
      })),
      lastPublishedProject: lastUpdatedProject ? {
        title: lastUpdatedProject.title || "Untitled",
        publishedAt: lastUpdatedProject.publishedAt,
      } : null,
      recentUpdates: recentUpdates.map((p: any) => ({
        _id: p._id,
        title: p.title || "Untitled",
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