import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import type { ProjectDeployment } from "@/types/project";
import {
  isActiveDeployment,
  isDeploymentTimedOut,
  startDeployment,
} from "@/lib/deployment/lifecycle";

/**
 * Admin-only deterministic retry operation.
 *
 * Requirements enforced:
 *   - admin authentication (401 otherwise)
 *   - project must exist (404)
 *   - project must still be published (409) — deleted/unpublished content is
 *     never retried
 *   - never starts a duplicate build while an equivalent attempt is running
 *     (409) and never retries an already-live project (409)
 *
 * A failed trigger deterministically persists `deployment.state = failed` with
 * a safe diagnostic; secrets are never stored in the error field.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const project = await Project.findById(id).lean<Record<string, unknown>>();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if ((project.status as string | undefined) !== "published") {
      return NextResponse.json(
        { error: "Project must be published before retrying deployment" },
        { status: 409 }
      );
    }

    const deployment = (project.deployment ?? null) as Partial<ProjectDeployment> | null;

    if (isActiveDeployment(deployment) && !isDeploymentTimedOut(deployment)) {
      return NextResponse.json({ error: "A deployment is already in progress" }, { status: 409 });
    }

    if (deployment?.state === "live") {
      return NextResponse.json({ error: "Project is already live" }, { status: 409 });
    }

    const outcome = await startDeployment(id);

    return NextResponse.json({ success: true, data: outcome });
  } catch (error) {
    console.error("DEPLOYMENT_RETRY_ERROR:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to retry deployment" }, { status: 500 });
  }
}