import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import { ALLOWED_EVENTS, parseUserAgent, extractReferrerDomain } from "@/lib/analytics-types";

const MAX_BODY_BYTES = 8192;
const MAX_PATH_LENGTH = 200;
const MAX_STRING_LENGTH = 200;
const MAX_METADATA_KEYS = 10;

const IGNORED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/apple-icon",
  "/icon",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".css",
  ".js",
  ".woff",
  ".woff2",
];

function shouldIgnorePath(p: string): boolean {
  return IGNORED_PATH_PREFIXES.some((prefix) => p.startsWith(prefix) || p.endsWith(prefix));
}

function clampString(val: unknown, max: number): string | undefined {
  if (typeof val !== "string" || !val.trim()) return undefined;
  return val.trim().slice(0, max) || undefined;
}

function isValidMetadata(m: unknown): Record<string, unknown> | undefined {
  if (!m || typeof m !== "object" || Array.isArray(m)) return undefined;
  const keys = Object.keys(m as Record<string, unknown>);
  if (keys.length > MAX_METADATA_KEYS) return undefined;
  const clean: Record<string, unknown> = {};
  for (const k of keys) {
    const v = (m as Record<string, unknown>)[k];
    if (typeof v === "string") {
      clean[k.slice(0, 50)] = v.slice(0, 500);
    } else if (typeof v === "number" || typeof v === "boolean") {
      clean[k.slice(0, 50)] = v;
    }
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export async function POST(req: Request) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const event = clampString(body.event, 40);
  const path = clampString(body.path, MAX_PATH_LENGTH);

  if (!event || !(ALLOWED_EVENTS as string[]).includes(event)) {
    return NextResponse.json({ error: "Invalid or missing event type" }, { status: 400 });
  }

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  if (shouldIgnorePath(path)) {
    return NextResponse.json({ success: true });
  }

  const projectSlug = clampString(body.projectSlug, MAX_STRING_LENGTH);
  const category = clampString(body.category, MAX_STRING_LENGTH);
  const label = clampString(body.label, MAX_STRING_LENGTH);
  const visitorHash = clampString(body.visitorHash, 64);
  const sessionId = clampString(body.sessionId, 64);
  const metadata = isValidMetadata(body.metadata);

  const type = event === "page_view" ? "page_view" : "interaction";
  const interactionType = event !== "page_view" ? event : undefined;

  try {
    await dbConnect();
  } catch (error) {
    console.error("ANALYTICS_DB_CONNECT_ERROR", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
  }

  const referrer = clampString(req.headers.get("referer"), 500);
  const userAgent = clampString(req.headers.get("user-agent"), 500);

  const parsed = userAgent ? parseUserAgent(userAgent) : undefined;
  const referrerDomain = referrer ? extractReferrerDomain(referrer) : undefined;

  try {
    await Analytics.create({
      type,
      page: path,
      projectId: projectSlug || undefined,
      interactionType,
      referrer: referrer || undefined,
      referrerDomain,
      category: category || undefined,
      label: label || undefined,
      userAgent: userAgent || undefined,
      deviceType: parsed?.deviceType,
      browser: parsed?.browser,
      os: parsed?.os,
      visitorHash: visitorHash || undefined,
      sessionId: sessionId || undefined,
      metadata,
    });
  } catch (error) {
    console.error("ANALYTICS_CREATE_ERROR", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ success: false, error: "Failed to save event" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
