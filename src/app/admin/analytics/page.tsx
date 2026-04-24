"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  BarChart3,
  Loader2,
  Users,
  Eye,
  FileText,
  Clock,
  Star,
  Layers
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import StatsChart from "@/components/admin/StatsChart";
import Link from "next/link";

interface EditorialData {
  projects: {
    total: number;
    published: number;
    draft: number;
    featured: number;
  };
  content: {
    hero: { status: string; lastPublished: Date | null };
    siteContent: { status: string; lastPublished: Date | null };
  };
  recentProjects: Array<{
    _id: string;
    title: string;
    status: string;
    featured: boolean;
    updatedAt: Date;
  }>;
  lastPublishedProject: { title: string; publishedAt: Date } | null;
  recentUpdates: Array<{
    _id: string;
    title: string;
    status: string;
    updatedAt: Date;
  }>;
}

interface LeadsData {
  total: number;
  byDate: Array<{ _id: string; count: number }>;
  recent: Array<{
    _id: string;
    email: string;
    name: string;
    status: string;
    createdAt: Date;
    projectType?: string;
  }>;
  byStatus: Record<string, number>;
}

export default function AnalyticsPage() {
  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ["business-insights"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/insights");
      return await res.json();
    }
  });

  const { data: trafficData, isLoading: trafficLoading } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      return await res.json();
    },
  });

  const { data: editorialData, isLoading: editorialLoading } = useQuery<EditorialData>({
    queryKey: ["editorial-insights"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/editorial");
      return await res.json();
    },
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery<LeadsData>({
    queryKey: ["leads-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/leads");
      return await res.json();
    },
  });

  const isLoading = insightsLoading || trafficLoading || editorialLoading || leadsLoading;

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Analytics...</div>;

  const insights = insightsData?.insights ?? [];
  const metrics = insightsData?.metrics ?? { globalCR: 0, completionRate: 0, totalViews: 0, totalLeads: 0 };

  const funnelData = [
    { name: "Total Visitors", value: metrics.totalViews, color: "#2D1B69" },
    { name: "Engagers", value: Math.round(metrics.totalViews * 0.4), color: "#3B2A82" },
    { name: "Prospects", value: Math.round((leadsData?.total || 0) * 1.5), color: "#00F5D4" },
    { name: "Leads", value: leadsData?.total || 0, color: "#00F5D4" }
  ];

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

      {/* Editorial Insights Section */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <FileText size={18} />
          Editorial Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="p-6 bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Users size={16} className="text-accent" />
              <span className="text-[10px] font-bold uppercase text-foreground/40">Total Leads</span>
            </div>
            <p className="text-3xl font-display font-bold">{leadsData?.total || 0}</p>
            <p className="text-[10px] text-foreground/40 mt-2">lifetime</p>
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

      {/* High-Level Insights */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <Zap size={18} />
          Business Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {insights.map((insight: any, i: number) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Traffic Visualization */}
        <div className="xl:col-span-8 space-y-8">
          {trafficData?.dailyViews && (
            <StatsChart data={trafficData.dailyViews} title="Daily Page Views" />
          )}

          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="text-xl font-display font-bold mb-6 uppercase">Project Status Distribution</h3>
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
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="text-xl font-display font-bold mb-6 uppercase">Conversion Funnel</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={funnelData} margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69" }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPIs & Metrics */}
        <div className="xl:col-span-4 space-y-8">
          <div className="p-8 bg-accent text-background pixel-border">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Global Conversion Rate</h3>
            <p className="text-5xl font-display font-bold">{metrics.globalCR.toFixed(1)}%</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-2">of visitors become leads</p>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Key Metrics</h3>
            
            <div className="flex justify-between items-end border-b border-primary/10 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase">Showreel Completion</p>
                <p className="text-[8px] text-foreground/40">Viewer retention</p>
              </div>
              <p className="text-2xl font-display font-bold">{metrics.completionRate.toFixed(1)}%</p>
            </div>
            
            <div className="flex justify-between items-end border-b border-primary/10 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase">Total Leads</p>
                <p className="text-[8px] text-foreground/40">Lifetime</p>
              </div>
              <p className="text-2xl font-display font-bold">{leadsData?.total || 0}</p>
            </div>

            <div className="flex justify-between items-end pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase">Page Views</p>
                <p className="text-[8px] text-foreground/40">All time</p>
              </div>
              <p className="text-2xl font-display font-bold">{metrics.totalViews}</p>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="p-6 bg-primary/5 border border-primary/10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-4">Recent Leads</h3>
            <div className="space-y-3">
              {leadsData?.recent?.slice(0, 5).map((lead: any) => (
                <div key={lead._id} className="flex justify-between items-center text-xs">
                  <span className="truncate flex-1">{lead.email}</span>
                  <span className={`ml-2 px-2 py-0.5 ${lead.status === 'new' ? 'bg-green-500/20 text-green-500' : 'text-foreground/40'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
              {(!leadsData?.recent || leadsData.recent.length === 0) && (
                <p className="text-xs text-foreground/40">No leads yet</p>
              )}
            </div>
            <Link href="/admin/leads" className="block mt-4 text-center text-[10px] text-accent hover:underline">
              View all leads →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}