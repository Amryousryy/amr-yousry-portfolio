import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Filter } from "@/models/Settings";
import { filterSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    await dbConnect();
    const query = isAdmin ? {} : { isActive: true };
    const filters = await Filter.find(query).sort({ displayOrder: 1 }).lean();
    
    return NextResponse.json(filters);
  } catch (error) {
    console.error("GET_FILTERS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = filterSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    const filter = await Filter.create(validation.data);
    return NextResponse.json(filter, { status: 201 });
  } catch (error) {
    console.error("POST_FILTER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
