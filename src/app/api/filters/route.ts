import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Filter from "@/models/Filter";
import { filterSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ data: [] });
  }

  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const query = isAdmin ? {} : { isActive: true };
    const filters = await Filter.find(query).sort({ displayOrder: 1 }).lean();
    
    return NextResponse.json({ data: Array.isArray(filters) ? filters : [] });
  } catch (error) {
    console.error("GET_FILTERS_ERROR:", error);
    return NextResponse.json({ data: [] });
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

  const validation = filterSchema.safeParse(body);
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
    const filter = await Filter.create(validation.data);
    return NextResponse.json({ data: filter }, { status: 201 });
  } catch (error) {
    console.error("POST_FILTER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}