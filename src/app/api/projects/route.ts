import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectCreateSchema } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import { checkReadiness, detectExpectedMediaType } from "@/lib/validation/project-readiness";
import { paginationSchema, getPagination } from "@/lib/pagination";
import { toPlainText } from "@/lib/text";

const STRING_FIELDS = ["title", "slug", "category", "shortDescription", "fullDescription", "image", "video", "client", "clientName", "problem", "strategy", "solution", "execution", "results", "mainResult", "idea"];
const ARRAY_FIELDS = ["tags", "categories", "services"];

function normalizeProjectFields(doc: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...doc };
  for (const field of STRING_FIELDS) {
    if (field in normalized) {
      normalized[field] = toPlainText(normalized[field]);
    }
  }
  for (const field of ARRAY_FIELDS) {
    const arr = normalized[field];
    if (Array.isArray(arr)) {
      normalized[field] = arr.map((item: unknown) => toPlainText(item));
    }
  }
  if (normalized.seo && typeof normalized.seo === "object") {
    const seo = normalized.seo as Record<string, unknown>;
    if (seo.title) seo.title = toPlainText(seo.title);
    if (seo.description) seo.description = toPlainText(seo.description);
  }
  return normalized;
}

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
    
    if (isAdmin) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return successResponse([]);
      }
    }

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

    const normalized = projects.map((p) => normalizeProjectFields(p as unknown as Record<string, unknown>)) as typeof projects;
    const pagination = getPagination(page, limit, total);
    return successResponse(normalized, pagination);
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

  if (Array.isArray(body.caseStudyMedia)) {
    body.caseStudyMedia = body.caseStudyMedia.map((item: Record<string, unknown>) => {
      const src = typeof item.src === "string" ? item.src : "";
      const type = typeof item.type === "string" ? item.type : "";
      if (!type) {
        const detected = detectExpectedMediaType(src);
        if (detected) item.type = detected;
      }
      return item;
    });
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

  if (validation.data.status === "published") {
    const readiness = checkReadiness(validation.data as unknown as Record<string, unknown>);
    if (!readiness.isPublishReady) {
      return NextResponse.json({
        error: "Project is not ready for publishing",
        issues: readiness.issues.filter(i => i.severity === "blocking").map(i => i.message)
      }, { status: 422 });
    }
  }

  try {
    const statusMetadata = validation.data.status === "published" 
      ? { publishedAt: new Date(), lastStatusChangeAt: new Date() }
      : { lastStatusChangeAt: new Date() };

    const project = await Project.create({ ...validation.data, ...statusMetadata });

    try {
      revalidatePath("/");
      revalidatePath("/projects");
      if (validation.data.slug) revalidatePath(`/projects/${validation.data.slug}`);
    } catch (revalError) {
      console.error("REVALIDATE_ERROR:", revalError);
    }

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
  } catch (error: unknown) {
    console.error("POST_PROJECT_ERROR:", error);
    const mongoErr = error as { code?: number; keyPattern?: Record<string, unknown> };
    if (mongoErr?.code === 11000 && mongoErr?.keyPattern?.slug) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}