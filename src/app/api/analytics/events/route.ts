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
  try {
    const body = await req.json();
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

    await dbConnect();

    const referrer = req.headers.get("referer") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const ipHash = ip ? simpleHash(ip) : undefined;

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TRACKING_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
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
