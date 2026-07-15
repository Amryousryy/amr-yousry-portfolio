import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { logActivity } from "@/lib/activity";

type BulkAction = "delete" | "publish" | "unpublish";

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

  let body: { action?: BulkAction; ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { action, ids } = body;
  if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "action and ids[] required" }, { status: 400 });
  }
  if (ids.length > 50) {
    return NextResponse.json({ error: "Maximum 50 items per batch" }, { status: 400 });
  }
  if (!["delete", "publish", "unpublish"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const now = new Date();
    let successCount = 0;
    let failCount = 0;
    const failedIds: string[] = [];

    if (action === "delete") {
      const result = await Project.deleteMany({ _id: { $in: ids } });
      successCount = result.deletedCount;
      failCount = ids.length - successCount;
      if (successCount > 0) {
        try { revalidatePath("/"); revalidatePath("/projects"); } catch {}
      }
    } else {
      const update = action === "publish"
        ? { status: "published" as const, publishedAt: now, lastStatusChangeAt: now }
        : { status: "draft" as const, lastStatusChangeAt: now };

      const result = await Project.updateMany({ _id: { $in: ids } }, { $set: update });
      successCount = result.modifiedCount;
      failCount = ids.length - successCount;
      if (successCount > 0) {
        try { revalidatePath("/"); revalidatePath("/projects"); } catch {}
      }
    }

    if (failCount > 0) {
      const found = await Project.find({ _id: { $in: ids } }).select("_id").lean();
      const foundIds = new Set(found.map((d) => String(d._id)));
      for (const id of ids) {
        if (!foundIds.has(id)) failedIds.push(id);
      }
    }

    try {
      await logActivity({
        action: action === "delete" ? "delete" : "update",
        targetType: "project",
        targetName: `Bulk ${action}: ${successCount} items`,
        adminEmail: session.user?.email || "unknown",
        metadata: { ids, successCount, failCount }
      });
    } catch (logError) {
      console.error("LOG_ACTIVITY_ERROR:", logError);
    }

    return NextResponse.json({
      success: true,
      data: { successCount, failCount, failedIds },
    });
  } catch (error) {
    console.error("BULK_ACTION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
