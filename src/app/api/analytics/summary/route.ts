import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import { toPlainText } from "@/lib/text";
import { getDateRange } from "@/lib/analytics-types";
import type { AnalyticsResponse, OverviewData, TrendPoint, TopPage, TopProject, ConversionEvent, DeviceStat, ReferrerStat, RecentEvent, DateRange } from "@/lib/analytics-types";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const rangeParam = (url.searchParams.get("range") || "7d") as DateRange;
    const range = ["24h", "7d", "30d", "all"].includes(rangeParam) ? rangeParam : "7d";
    const since = getDateRange(range);

    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const matchStage = since ? { createdAt: { $gte: since } } : {};

    const [
      totalVisits,
      uniqueVisitorsResult,
      visitsToday,
      visits7d,
      visits30d,
      projectDetailViews,
      contactActions,
      trendResult,
      topPagesResult,
      topProjectsResult,
      conversionsResult,
      devicesResult,
      referrersResult,
      recentResult,
    ] = await Promise.all([
      Analytics.countDocuments({ ...matchStage }),
      Analytics.distinct("visitorHash", { ...matchStage, visitorHash: { $exists: true, $ne: "" } }),
      Analytics.countDocuments({ createdAt: { $gte: todayStart } }),
      Analytics.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Analytics.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Analytics.countDocuments({ interactionType: "project_detail_view", ...matchStage }),
      Analytics.countDocuments({ interactionType: { $in: ["contact_cta_click", "form_submit", "email_click", "whatsapp_click"] }, ...matchStage }),
      Analytics.aggregate([
        { $match: { type: "page_view", ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            visits: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$visitorHash" },
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            visits: 1,
            uniqueVisitors: { $size: "$uniqueVisitors" },
          }
        }
      ]),
      Analytics.aggregate([
        { $match: { type: "page_view", ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: "$page",
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$visitorHash" },
            lastVisit: { $max: "$createdAt" },
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            path: "$_id",
            views: 1,
            uniqueVisitors: { $size: "$uniqueVisitors" },
            lastVisit: 1,
          }
        }
      ]),
      Analytics.aggregate([
        { $match: { interactionType: "project_detail_view", ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: "$page",
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$visitorHash" },
          }
        },
        { $sort: { views: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "slug",
            as: "project"
          }
        },
        {
          $addFields: {
            slug: { $arrayElemAt: ["$project.slug", 0] },
            title: { $arrayElemAt: ["$project.title", 0] },
          }
        },
        { $project: { slug: 1, title: 1, views: 1, uniqueVisitors: { $size: "$uniqueVisitors" }, _id: 0 } }
      ]),
      Analytics.aggregate([
        { $match: { interactionType: { $ne: null }, ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: "$interactionType",
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } }
      ]),
      Analytics.aggregate([
        { $match: { deviceType: { $exists: true, $ne: "" }, ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: "$deviceType",
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } },
        { $project: { _id: 0, type: "$_id", count: 1 } }
      ]),
      Analytics.aggregate([
        { $match: { referrerDomain: { $exists: true, $ne: "" }, ...(since ? { createdAt: { $gte: since } } : {}) } },
        {
          $group: {
            _id: "$referrerDomain",
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, domain: "$_id", count: 1 } }
      ]),
      Analytics.find({ ...(since ? { createdAt: { $gte: since } } : {}) })
        .sort({ createdAt: -1 })
        .limit(30)
        .select("type interactionType page deviceType referrerDomain createdAt")
        .lean() as unknown as Array<{
          _id: unknown; type: string; interactionType?: string; page: string;
          deviceType?: string; referrerDomain?: string; createdAt: Date;
        }>,
    ]);

    const uniqueVisitors = uniqueVisitorsResult.length;

    // Calculate top project and top referrer for overview
    const topProjectData = topProjectsResult.length > 0
      ? { slug: topProjectsResult[0].slug || "", title: toPlainText(topProjectsResult[0].title) || topProjectsResult[0].slug, views: topProjectsResult[0].views }
      : null;

    const topReferrerData = referrersResult.length > 0
      ? { domain: referrersResult[0].domain, count: referrersResult[0].count }
      : null;

    const overview: OverviewData = {
      totalVisits,
      uniqueVisitors,
      visitsToday,
      visits7d,
      visits30d,
      projectDetailViews,
      contactActions,
      topProject: topProjectData,
      topReferrer: topReferrerData,
    };

    const trend: TrendPoint[] = trendResult.map((d: TrendPoint) => ({
      date: d.date,
      visits: d.visits,
      uniqueVisitors: d.uniqueVisitors,
    }));

    const topPages: TopPage[] = topPagesResult.map((p: TopPage) => ({
      path: p.path,
      views: p.views,
      uniqueVisitors: p.uniqueVisitors,
      lastVisit: p.lastVisit ? new Date(p.lastVisit as unknown as Date).toISOString() : null,
    }));

    const topProjects: TopProject[] = topProjectsResult.map((p: TopProject) => ({
      slug: p.slug || "",
      title: toPlainText(p.title) || p.slug,
      views: p.views,
      uniqueVisitors: p.uniqueVisitors,
    }));

    const conversions: ConversionEvent[] = conversionsResult.map((c: { _id: string; count: number }) => ({
      event: c._id as string,
      count: c.count,
    }));

    const devices: DeviceStat[] = devicesResult.map((d: DeviceStat) => ({
      type: d.type,
      count: d.count,
    }));

    const referrers: ReferrerStat[] = referrersResult.map((r: ReferrerStat) => ({
      domain: r.domain,
      count: r.count,
    }));

    const recentEvents: RecentEvent[] = recentResult.map((e) => ({
      _id: String(e._id),
      type: e.type,
      interactionType: e.interactionType,
      page: e.page,
      deviceType: e.deviceType,
      referrerDomain: e.referrerDomain,
      createdAt: (e.createdAt as Date).toISOString(),
    }));

    const response: AnalyticsResponse = {
      overview,
      trend,
      topPages,
      topProjects,
      conversions,
      devices,
      referrers,
      recentEvents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("SUMMARY_GET_ERROR:", error);
    return NextResponse.json({
      overview: { totalVisits: 0, uniqueVisitors: 0, visitsToday: 0, visits7d: 0, visits30d: 0, projectDetailViews: 0, contactActions: 0, topProject: null, topReferrer: null },
      trend: [],
      topPages: [],
      topProjects: [],
      conversions: [],
      devices: [],
      referrers: [],
      recentEvents: [],
    });
  }
}