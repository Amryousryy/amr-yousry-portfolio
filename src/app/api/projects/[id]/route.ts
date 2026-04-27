import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectUpdateSchema } from "@/lib/validation";
import { deleteCloudinaryResources } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    await dbConnect();
    
    let project;
    const query: Record<string, unknown> = {};
    
    if (!isAdmin) {
      query.status = "published";
    }
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findOne({ _id: id, ...query }).lean();
    }
    
    if (!project) {
      project = await Project.findOne({ slug: id, ...query }).lean();
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
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
    const validation = projectUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    
    const currentProject = await Project.findById(id).lean() as any;
    const currentStatus = currentProject?.status || "draft";
    const newStatus = validation.data.status || "draft";
    
    const statusMetadata: Record<string, Date> = {
      lastStatusChangeAt: new Date(),
    };
    
    if (newStatus === "published" && currentStatus !== "published") {
      statusMetadata.publishedAt = new Date();
    }
    
    const project = await Project.findByIdAndUpdate(
      id, 
      { ...validation.data, ...statusMetadata }, 
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await logActivity({
      action: "update",
      targetType: "project",
      targetName: validation.data.title || "Untitled",
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
    
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const urlsToDelete: string[] = [
      project.image,
      project.video,
      ...(project.gallery || []),
      ...(project.sections || []).flatMap((s: any) => (s.media || []).map((m: any) => m.url))
    ].filter((url): url is string => !!url);

    await deleteCloudinaryResources(urlsToDelete);

    const projectTitle = project.title;

    await Project.findByIdAndDelete(id);

    await logActivity({
      action: "delete",
      targetType: "project",
      targetName: projectTitle,
      adminEmail: session.user?.email || "unknown",
      metadata: { id }
    });
    
    return NextResponse.json({ message: "Project and associated assets deleted successfully" });
  } catch (error) {
    console.error("DELETE_PROJECT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}