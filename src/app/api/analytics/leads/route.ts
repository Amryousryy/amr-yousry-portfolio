import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalLeads,
      leadsByDate,
      recentLeads,
      leadsByStatus,
    ] = await Promise.all([
      Lead.countDocuments({}),
      Lead.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]),
      Lead.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .select("email name createdAt status metadata")
        .lean(),
      Lead.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
    ]);

    const statusMap = leadsByStatus.reduce((acc: Record<string, number>, item: any) => {
      acc[item._id || "unknown"] = item.count;
      return acc;
    }, {});

    return NextResponse.json({
      total: totalLeads,
      byDate: leadsByDate.reverse(),
      recent: recentLeads.map((l: any) => ({
        _id: l._id,
        email: l.email,
        name: l.name,
        status: l.status,
        createdAt: l.createdAt,
        projectType: l.metadata?.projectType,
      })),
      byStatus: statusMap,
    });
  } catch (error) {
    console.error("LEADS_ANALYTICS_ERROR:", error);
    return NextResponse.json({
      total: 0,
      byDate: [],
      recent: [],
      byStatus: {},
    });
  }
}