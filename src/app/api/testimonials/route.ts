import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { testimonialCreateSchema } from "@/lib/validation/testimonial";

function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data });
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
    const featured = searchParams.get("featured") === "true";
    
    const query: Record<string, unknown> = {};
    if (!isAdmin) query.status = "published";
    if (featured) query.isFeatured = true;

    const testimonials = await Testimonial.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return successResponse(testimonials);
  } catch (error) {
    console.error("GET_TESTIMONIALS_ERROR:", error);
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

  const validation = testimonialCreateSchema.safeParse(body);
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
    const testimonial = await Testimonial.create(validation.data);
    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error) {
    console.error("POST_TESTIMONIAL_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}