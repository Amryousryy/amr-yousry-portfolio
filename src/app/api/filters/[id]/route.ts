import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Filter from "@/models/Filter";
import { filterUpdateSchema } from "@/lib/validation";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = filterUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    const filter = await Filter.findByIdAndUpdate(id, validation.data, { new: true });
    
    if (!filter) {
      return NextResponse.json({ error: "Filter not found" }, { status: 404 });
    }
    
    return NextResponse.json(filter);
  } catch (error) {
    console.error("PUT_FILTER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Filter.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Filter deleted successfully" });
  } catch (error) {
    console.error("DELETE_FILTER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
