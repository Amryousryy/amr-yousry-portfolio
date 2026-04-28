import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { testimonialUpdateSchema } from "@/lib/validation/testimonial";

function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return successResponse(testimonial);
  } catch (error) {
    console.error("GET_TESTIMONIAL_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("SESSION_ERROR:", error);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validation = testimonialUpdateSchema.safeParse(body);
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
    const testimonial = await Testimonial.findByIdAndUpdate(id, validation.data, { new: true });
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return successResponse(testimonial);
  } catch (error) {
    console.error("PUT_TESTIMONIAL_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("SESSION_ERROR:", error);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return successResponse({ success: true });
  } catch (error) {
    console.error("DELETE_TESTIMONIAL_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}