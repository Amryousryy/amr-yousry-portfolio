import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectCreateSchema } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import { paginationSchema, getPagination } from "@/lib/pagination";

function successResponse<T>(data: T, pagination?: ReturnType<typeof getPagination>) {
  return NextResponse.json({
    success: true,
    data,
    ...(pagination && {
      meta: {
        current: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
        hasNext: pagination.hasNextPage,
        hasPrev: pagination.hasPrevPage,
      }
    })
  });
}

export async function GET(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return successResponse([]);
  }

  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    const query: Record<string, unknown> = isAdmin ? {} : { status: "published" };
    
    if (featured === "true") query.featured = true;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }
    
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 12,
    });
    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 12 };
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(query)
    ]);

    const pagination = getPagination(page, limit, total);
    return successResponse(projects, pagination);
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);
    return successResponse([]);
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

  const validation = projectCreateSchema.safeParse(body);
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
    const statusMetadata = validation.data.status === "published" 
      ? { publishedAt: new Date(), lastStatusChangeAt: new Date() }
      : { lastStatusChangeAt: new Date() };

    const project = await Project.create({ ...validation.data, ...statusMetadata });

    try {
      await logActivity({
        action: "create",
        targetType: "project",
        targetName: validation.data.title,
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