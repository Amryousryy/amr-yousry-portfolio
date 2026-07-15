import dbConnect from "./db";
import Analytics from "@/models/Analytics";
import Project from "@/models/Project";
import { safeProjectTitle } from "./safe-project-title";

export interface Insight {
  type: "positive" | "negative" | "opportunity";
  title: string;
  description: string;
  impact: string;
  action: string;
}

export async function generateBusinessInsights() {
  try {
    await dbConnect();
  } catch {
    return { metrics: { completionRate: 0, totalViews: 0 }, insights: [] };
  }

  const insights: Insight[] = [];

  // 1. Page view tracking status
  let totalViews = 0;
  try {
    totalViews = await Analytics.countDocuments({ type: "page_view" });
  } catch {
    totalViews = 0;
  }

  if (totalViews === 0) {
    insights.push({
      type: "opportunity",
      title: "No Page Views Yet",
      description: "Client-side analytics tracking has been implemented but no page views have been recorded yet.",
      impact: "Engagement data will populate once visitors browse the public site.",
      action: "Visit the public site and navigate between pages to generate initial tracking data."
    });
  }

  // 2. Showreel Engagement Analysis
  let showreelPlays = 0;
  let showreelCompletions = 0;
  try {
    showreelPlays = await Analytics.countDocuments({ interactionType: "showreel_play" });
    showreelCompletions = await Analytics.countDocuments({ interactionType: "showreel_complete" });
  } catch {
    showreelPlays = 0;
    showreelCompletions = 0;
  }
  const completionRate = showreelPlays > 0 ? (showreelCompletions / showreelPlays) * 100 : 0;

  if (showreelPlays > 0 && completionRate < 30 && showreelPlays > 10) {
    insights.push({
      type: "negative",
      title: "Showreel Drop-off",
      description: `Only ${completionRate.toFixed(1)}% of viewers watch your full showreel.`,
      impact: "High-value work at the end of your reel is being missed.",
      action: "Front-load your most impressive clips in the first 10 seconds."
    });
  } else if (showreelPlays > 0 && completionRate > 50) {
    insights.push({
      type: "positive",
      title: "Showreel Mastery",
      description: "Over half of your viewers watch the entire reel.",
      impact: "Exceptional retention and brand interest.",
      action: "Add a secondary CTA midway through the video for even higher conversion."
    });
  }

  // 3. Underperforming Content
  let projectViews: { _id: unknown; views: number }[] = [];
  try {
    projectViews = await Analytics.aggregate([
      { $match: { type: "page_view", projectId: { $ne: null } } },
      { $group: { _id: "$projectId", views: { $sum: 1 } } }
    ]);
  } catch {
    projectViews = [];
  }

  const popularIds = projectViews.filter(p => p.views > 50).map(p => p._id);
  if (popularIds.length > 0) {
    const projects = await Project.find({ slug: { $in: popularIds } });
    for (const project of projects) {
      const title = safeProjectTitle(project);
      insights.push({
          type: "opportunity",
          title: "Popular Project",
          description: `'${title}' is attracting significant views.`,
          impact: "This project is your best converting asset — leverage it.",
          action: "Add a clear CTA or link to your services at the end of this project page."
      });
      break;
    }
  }

  return {
    metrics: {
      completionRate,
      totalViews
    },
    insights
  };
}
