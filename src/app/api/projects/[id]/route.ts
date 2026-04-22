import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { deleteCloudinaryResources } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    // Try finding by ID, if not valid ObjectId or not found, try by slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id).lean();
    }
    
    if (!project) {
      project = await Project.findOne({ slug: id }).lean();
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET_PROJECT_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = projectSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    
    // Regenerate slug if English title changed
    const slug = validation.data.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project = await Project.findByIdAndUpdate(
      id, 
      { ...validation.data, slug }, 
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await logActivity({
      action: "update",
      targetType: "project",
      targetName: validation.data.title.en,
      adminEmail: session.user?.email || "unknown",
      metadata: { id, status: project.status }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT_PROJECT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Find project first to get media URLs
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Collect all Cloudinary URLs
    const urlsToDelete: string[] = [
      project.image,
      project.video,
      ...(project.gallery || []),
      ...(project.sections || []).flatMap((s: any) => (s.media || []).map((m: any) => m.url))
    ].filter((url): url is string => !!url);

    // Delete from Cloudinary
    await deleteCloudinaryResources(urlsToDelete);

    const titleEn = project.title.en;

    // Delete from MongoDB
    await Project.findByIdAndDelete(id);

    await logActivity({
      action: "delete",
      targetType: "project",
      targetName: titleEn,
      adminEmail: session.user?.email || "unknown",
      metadata: { id }
    });
    
    return NextResponse.json({ message: "Project and associated assets deleted successfully" });
  } catch (error) {
    console.error("DELETE_PROJECT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
