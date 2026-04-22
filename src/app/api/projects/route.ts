import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    await dbConnect();
    
    // Public users only see published projects
    const query = isAdmin ? {} : { status: "published" };
    const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
    
    return NextResponse.json(projects);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch projects";
    console.error("DATABASE_ERROR:", errorMessage);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    
    // Generate slug from English title
    const slug = validation.data.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project = await Project.create({ ...validation.data, slug });

    await logActivity({
      action: "create",
      targetType: "project",
      targetName: validation.data.title.en,
      adminEmail: session.user?.email || "unknown",
      metadata: { id: project._id, status: project.status }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("POST_PROJECT_ERROR:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
