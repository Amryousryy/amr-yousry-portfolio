import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const logs = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET_ACTIVITY_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}
