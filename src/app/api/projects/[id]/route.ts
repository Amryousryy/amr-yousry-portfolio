import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { projectUpdateSchema } from "@/lib/validation";
import { deleteCloudinaryResources } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity";
import { checkReadiness, detectExpectedMediaType } from "@/lib/validation/project-readiness";
import { toPlainText } from "@/lib/text";

function normalizeProject(doc: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...doc };
  const stringFields = ["title", "slug", "category", "shortDescription", "fullDescription", "image", "video", "client", "clientName", "problem", "strategy", "solution", "execution", "results", "mainResult", "idea", "outcome", "role"];
  const arrayFields = ["tags", "categories", "services", "gallery"];
  for (const field of stringFields) {
    if (field in normalized) {
      normalized[field] = toPlainText(normalized[field]);
    }
  }
  for (const field of arrayFields) {
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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

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
    return NextResponse.json({ success: true, data: normalizeProject(project as unknown as Record<string, unknown>) });
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

    const validation = projectUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();

    const currentProject = await Project.findById(id).lean() as any;
    if (!currentProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (validation.data.status === "published") {
      const mergedData = { ...currentProject, ...validation.data };
      const readiness = checkReadiness(mergedData as unknown as Record<string, unknown>);
      if (!readiness.isPublishReady) {
        return NextResponse.json({
          error: "Project is not ready for publishing",
          issues: readiness.issues.filter(i => i.severity === "blocking").map(i => i.message)
        }, { status: 422 });
      }
    }

    const currentStatus = currentProject?.status || "draft";
    const newStatus = validation.data.status || "draft";
    
    const statusMetadata: Record<string, Date> = {
      lastStatusChangeAt: new Date(),
    };
    
    if (newStatus === "published" && currentStatus !== "published") {
      statusMetadata.publishedAt = new Date();
    }
    
    const existing = currentProject as Record<string, unknown> | null;
    const guardedArrayFields = new Set(["services", "detailedResults", "caseStudyMedia", "gallery", "tags", "sections", "categories"]);
    const guardedTextField = new Set(["solution", "results", "category"]);

    const bodyKeys = new Set(Object.keys(body));
    const safeUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(validation.data)) {
      if (!bodyKeys.has(key)) continue;
      if (key.startsWith("_") || key === "createdAt" || key === "updatedAt" || key === "__v") continue;

      if (guardedArrayFields.has(key)) {
        if (Array.isArray(value)) {
          safeUpdate[key] = value.filter((item: unknown) => {
            if (typeof item === "string") return item.trim().length > 0;
            if (item && typeof item === "object" && "src" in (item as Record<string, unknown>)) {
              return typeof (item as Record<string, unknown>).src === "string" && ((item as Record<string, unknown>).src as string).trim().length > 0;
            }
            return true;
          });
        }
      } else if (guardedTextField.has(key)) {
        if (typeof value === "string" && value.trim().length > 0) {
          safeUpdate[key] = value.trim();
        }
      } else if (key === "seo") {
        const incoming = (value && typeof value === "object") ? value as Record<string, unknown> : {};
        const existingSeo = (existing?.seo && typeof existing.seo === "object") ? existing.seo as Record<string, unknown> : {};
        safeUpdate.seo = {
          title: (typeof incoming.title === "string" && incoming.title.length > 0) ? incoming.title : (existingSeo.title || ""),
          description: (typeof incoming.description === "string" && incoming.description.length > 0) ? incoming.description : (existingSeo.description || ""),
          keywords: (Array.isArray(incoming.keywords) && incoming.keywords.length > 0) ? incoming.keywords : (Array.isArray(existingSeo.keywords) ? existingSeo.keywords : []),
        };
      } else {
        safeUpdate[key] = value;
      }
    }

    const project = await Project.findByIdAndUpdate(
      id, 
      { ...safeUpdate, ...statusMetadata }, 
      { new: true, lean: true }
    );
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/projects");
      if (validation.data.slug) revalidatePath(`/projects/${validation.data.slug}`);
      if (currentProject?.slug && currentProject.slug !== validation.data.slug) {
        revalidatePath(`/projects/${currentProject.slug}`);
      }
    } catch (revalError) {
      console.error("REVALIDATE_ERROR:", revalError);
    }

    if (newStatus === "published" && currentStatus !== "published") {
      await logActivity({
        action: "publish",
        targetType: "project",
        targetName: validation.data.title || currentProject.title || "Untitled",
        adminEmail: session.user?.email || "unknown",
        metadata: { id, status: "published" }
      });
    } else {
      await logActivity({
        action: "update",
        targetType: "project",
        targetName: validation.data.title || currentProject.title || "Untitled",
        adminEmail: session.user?.email || "unknown",
        metadata: { id, status: (project as any).status }
      });
    }
    
    return NextResponse.json({ data: normalizeProject(project as unknown as Record<string, unknown>) });
  } catch (error: unknown) {
    console.error("PUT_PROJECT_ERROR:", error);
    const mongoErr = error as { code?: number; keyPattern?: Record<string, unknown> };
    if (mongoErr?.code === 11000 && mongoErr?.keyPattern?.slug) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
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
    const deletedSlug = project.slug;

    await Project.findByIdAndDelete(id);

    try {
      revalidatePath("/");
      revalidatePath("/projects");
      if (deletedSlug) revalidatePath(`/projects/${deletedSlug}`);
    } catch (revalError) {
      console.error("REVALIDATE_ERROR:", revalError);
    }

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