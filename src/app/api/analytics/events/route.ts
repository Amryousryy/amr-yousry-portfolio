import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";

const ALLOWED_EVENTS = [
  "page_view",
  "project_card_click",
  "project_detail_view",
  "category_filter_click",
  "contact_cta_click",
  "showreel_click",
];

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { event, path, projectSlug, category, label, metadata } = body;

  if (!event || !ALLOWED_EVENTS.includes(event)) {
    return NextResponse.json({ error: "Invalid or missing event type" }, { status: 400 });
  }

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const type = event === "page_view" ? "page_view" : "interaction";
  const interactionType = event !== "page_view" ? event : undefined;
  const projectId = projectSlug || undefined;

  try {
    await dbConnect();
  } catch (error) {
    console.error("ANALYTICS_DB_CONNECT_ERROR", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      code: typeof error === "object" && error !== null && "code" in error ? (error as { code?: number }).code : undefined,
    });
    return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
  }

  const referrer = req.headers.get("referer") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ipHash = ip ? simpleHash(ip) : undefined;

  try {
    await Analytics.create({
      type,
      page: path,
      projectId,
      interactionType,
      referrer,
      category,
      label,
      userAgent,
      ipHash,
      metadata,
    });
  } catch (error) {
    console.error("ANALYTICS_CREATE_ERROR", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      code: typeof error === "object" && error !== null && "code" in error ? (error as { code?: number }).code : undefined,
      validationErrors: typeof error === "object" && error !== null && "errors" in error
        ? Object.keys((error as { errors?: Record<string, unknown> }).errors || {})
        : undefined,
    });
    return NextResponse.json({ success: false, error: "Failed to save event" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
