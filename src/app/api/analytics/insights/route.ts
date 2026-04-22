import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateBusinessInsights } from "@/lib/insight-engine";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const insights = await generateBusinessInsights();
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error("INSIGHTS_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
