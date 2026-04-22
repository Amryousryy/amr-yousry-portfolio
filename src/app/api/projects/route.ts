import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ data: [] });
  }

  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const query = isAdmin ? {} : { status: "published" };
    const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
    
    return NextResponse.json({ data: Array.isArray(projects) ? projects : [] });
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: Request) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("SESSION_ERROR:", error);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const slug = validation.data.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project = await Project.create({ ...validation.data, slug });

    try {
      await logActivity({
        action: "create",
        targetType: "project",
        targetName: validation.data.title.en,
        adminEmail: session.user?.email || "unknown",
        metadata: { id: project._id, status: project.status }
      });
    } catch (logError) {
      console.error("LOG_ACTIVITY_ERROR:", logError);
    }

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("POST_PROJECT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}