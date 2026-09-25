import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { reconcileDeployment, type ReconciliationResult } from "@/lib/deployment/lifecycle";

/**
 * Admin-only deployment status endpoint.
 *
 * Reconciles the stored deployment state against Vercel and the canonical
 * project URL. Never public: returns 401 without a valid admin session.
 * Returns only safe deployment metadata — never credentials, never the Build
 * Hook URL, never API tokens.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const result: ReconciliationResult = await reconcileDeployment(
      project as unknown as Parameters<typeof reconcileDeployment>[0]
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("DEPLOYMENT_STATUS_ERROR:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to fetch deployment status" }, { status: 500 });
  }
}