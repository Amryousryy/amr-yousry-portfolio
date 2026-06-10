"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Loader2,
  FileText,
  Clock,
  Star,
  Layers,
  Eye,
  MousePointerClick,
  Filter,
  MessageSquare,
  Video,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface SummaryData {
  totalEvents: number;
  pageViews: number;
  projectDetailViews: number;
  projectCardClicks: number;
  categoryFilterClicks: number;
  contactCtaClicks: number;
  showreelClicks: number;
  recentEventsCount: number;
  topProjects: Array<{ slug: string; title: string; count: number }>;
  topCategories: Array<{ _id: string; count: number }>;
  dailyViews: Array<{ _id: string; count: number }>;
}

interface EditorialData {
  projects: { total: number; published: number; draft: number; featured: number };
  content: {
    hero: { status: string; lastPublished: Date | null };
    siteContent: { status: string; lastPublished: Date | null };
  };
  lastPublishedProject: { title: string; publishedAt: Date } | null;
}

const METRIC_CARDS = [
  { key: "totalEvents", label: "Total Events", icon: BarChart3, color: "#00F5D4" },
  { key: "pageViews", label: "Page Views", icon: Eye, color: "#22D3EE" },
  { key: "projectDetailViews", label: "Project Detail Views", icon: Eye, color: "#818CF8" },
  { key: "projectCardClicks", label: "Project Card Clicks", icon: MousePointerClick, color: "#F59E0B" },
  { key: "categoryFilterClicks", label: "Filter Clicks", icon: Filter, color: "#10B981" },
  { key: "contactCtaClicks", label: "Contact CTA Clicks", icon: MessageSquare, color: "#EC4899" },
  { key: "showreelClicks", label: "Showreel Clicks", icon: Video, color: "#8B5CF6" },
  { key: "recentEventsCount", label: "Recent Events (7d)", icon: Calendar, color: "#F97316" },
] as const;

export default function AnalyticsPage() {
  const { data: summaryData, isLoading: summaryLoading, isError: summaryError } = useQuery<SummaryData>({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/summary");
      if (!res.ok) throw new Error("Failed to fetch summary");
      return await res.json();
    }
  });

  const { data: editorialData, isLoading: editorialLoading } = useQuery<EditorialData>({
    queryKey: ["editorial-insights"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/editorial");
      return await res.json();
    },
  });

  const { data: insightsData } = useQuery({
    queryKey: ["business-insights"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/insights");
      return await res.json();
    }
  });

  const isLoading = summaryLoading || editorialLoading;

  if (isLoading) {
    return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Analytics...</div>;
  }

  if (summaryError) {
    return (
      <div className="p-20 text-center">
        <AlertCircle className="inline mr-2 text-red-500" size={20} />
        <span className="text-foreground/60">Failed to load analytics data.</span>
      </div>
    );
  }

  const insights = insightsData?.insights ?? [];
  const s = summaryData!;

  const projectStatusData = editorialData ? [
    { name: "Published", value: editorialData.projects.published, color: "#00F5D4" },
    { name: "Draft", value: editorialData.projects.draft, color: "#F59E0B" },
  ] : [];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Analytics & Insights</h1>
        <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Performance metrics and editorial guidance</p>
      </header>

      {/* Summary Metric Cards */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <TrendingUp size={18} />
          Engagement Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {METRIC_CARDS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color }} />
                <span className="text-[9px] font-bold uppercase text-foreground/40">{label}</span>
              </div>
              <p className="text-2xl font-display font-bold" style={{ color }}>
                {String(s[key as keyof SummaryData] ?? 0)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {s.totalEvents === 0 && (
        <div className="p-10 bg-primary/5 border border-primary/10 text-center">
          <BarChart3 size={32} className="mx-auto mb-4 text-foreground/20" />
          <p className="text-sm font-bold uppercase tracking-wider text-foreground/60">
            No analytics events recorded yet.
          </p>
          <p className="text-[10px] text-foreground/40 mt-2">
            Visit the public site to generate engagement data.
          </p>
        </div>
      )}

      {/* Editorial Status */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <FileText size={18} />
          Editorial Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Layers size={16} className="text-accent" />
              <span className="text-[10px] font-bold uppercase text-foreground/40">Projects</span>
            </div>
            <p className="text-3xl font-display font-bold">{editorialData?.projects.total || 0}</p>
            <div className="flex gap-2 mt-2 text-[10px]">
              <span className="text-green-500">{editorialData?.projects.published || 0} published</span>
              <span className="text-yellow-500">{editorialData?.projects.draft || 0} draft</span>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Star size={16} className="text-accent" />
              <span className="text-[10px] font-bold uppercase text-foreground/40">Featured</span>
            </div>
            <p className="text-3xl font-display font-bold">{editorialData?.projects.featured || 0}</p>
            <p className="text-[10px] text-foreground/40 mt-2">published projects</p>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={16} className="text-accent" />
              <span className="text-[10px] font-bold uppercase text-foreground/40">Last Published</span>
            </div>
            {editorialData?.lastPublishedProject ? (
              <>
                <p className="text-sm font-bold truncate">{editorialData.lastPublishedProject.title}</p>
                <p className="text-[10px] text-foreground/40 mt-1">
                  {new Date(editorialData.lastPublishedProject.publishedAt).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-foreground/40">No published projects</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-primary/5 border border-primary/10">
          <h3 className="text-sm font-bold uppercase mb-4">Hero Section</h3>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-xs font-bold uppercase ${
              editorialData?.content.hero.status === 'published' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-yellow-500/20 text-yellow-500'
            }`}>
              {editorialData?.content.hero.status || 'unknown'}
            </span>
            {editorialData?.content.hero.lastPublished && (
              <span className="text-xs text-foreground/40">
                Published: {new Date(editorialData.content.hero.lastPublished).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 bg-primary/5 border border-primary/10">
          <h3 className="text-sm font-bold uppercase mb-4">Site Content</h3>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-xs font-bold uppercase ${
              editorialData?.content.siteContent.status === 'published' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-yellow-500/20 text-yellow-500'
            }`}>
              {editorialData?.content.siteContent.status || 'unknown'}
            </span>
            {editorialData?.content.siteContent.lastPublished && (
              <span className="text-xs text-foreground/40">
                Published: {new Date(editorialData.content.siteContent.lastPublished).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Top Projects */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <Eye size={18} />
          Top Projects
        </h2>
        {s.topProjects.length > 0 ? (
          <div className="space-y-2">
            {s.topProjects.map((p, i) => (
              <div key={p.slug || i} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-bold text-foreground/30 w-5">{i + 1}.</span>
                  <span className="text-sm font-bold truncate">{p.title || p.slug}</span>
                </div>
                <span className="text-sm font-display font-bold text-accent shrink-0">{p.count} views</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/40 italic">No project detail views yet.</p>
        )}
      </div>

      {/* Top Categories */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <Filter size={18} />
          Top Categories
        </h2>
        {s.topCategories.length > 0 ? (
          <div className="space-y-2">
            {s.topCategories.map((c, i) => (
              <div key={c._id || i} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-foreground/30 w-5">{i + 1}.</span>
                  <span className="text-sm font-bold uppercase">{c._id}</span>
                </div>
                <span className="text-sm font-display font-bold text-accent">{c.count} clicks</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/40 italic">No category filter clicks yet.</p>
        )}
      </div>

      {/* Project Status + Daily Views side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-7 space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="text-xl font-display font-bold mb-6 uppercase">Project Status Distribution</h3>
            {projectStatusData.some(d => d.value > 0) ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={projectStatusData} margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69" }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-foreground/40 italic">No project data yet.</p>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="text-xl font-display font-bold mb-6 uppercase">Daily Views (7d)</h3>
            {s.dailyViews.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.dailyViews} margin={{ bottom: 20, left: 0, right: 0 }}>
                    <XAxis
                      dataKey="_id"
                      stroke="#ffffff40"
                      fontSize={9}
                      tickFormatter={(val: string) => val.slice(5)}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69" }}
                      labelFormatter={(val) => typeof val === 'string' ? new Date(val).toLocaleDateString() : val}
                    />
                    <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={24}>
                      {s.dailyViews.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#00F5D4" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-foreground/40 italic">No views in the last 7 days.</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
            <Zap size={18} />
            Business Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {insights.map((insight: { type: string; title: string; description: string; action: string }, i: number) => (
              <div key={i} className={`p-6 border-l-4 ${
                insight.type === 'positive' ? 'bg-green-500/5 border-green-500' :
                insight.type === 'negative' ? 'bg-red-500/5 border-red-500' :
                'bg-accent/5 border-accent'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {insight.type === 'positive' ? <CheckCircle size={18} className="text-green-500" /> :
                   insight.type === 'negative' ? <AlertCircle size={18} className="text-red-500" /> :
                   <Zap size={18} className="text-accent" />}
                  <h3 className="font-bold uppercase text-sm">{insight.title}</h3>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed mb-3">{insight.description}</p>
                <p className="text-[10px] font-bold uppercase text-accent">{insight.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
