"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, Eye, Monitor, Smartphone, Tablet, Globe, TrendingUp,
  MousePointerClick, MessageSquare, Mail, Phone, Video, FileText,
  Clock, Users, Activity, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { AnalyticsResponse, DateRange } from "@/lib/analytics-types";

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

const CONVERSION_LABELS: Record<string, string> = {
  contact_cta_click: "Contact CTA",
  form_submit: "Form Submit",
  email_click: "Email Click",
  whatsapp_click: "WhatsApp Click",
  showreel_click: "Showreel View",
  showreel_play: "Showreel Play",
  showreel_complete: "Showreel Complete",
  project_card_click: "Card Click",
  project_detail_view: "Detail View",
  category_filter_click: "Filter Click",
  page_view: "Page View",
};

const CONVERSION_ICONS: Record<string, React.ElementType> = {
  contact_cta_click: MessageSquare,
  form_submit: FileText,
  email_click: Mail,
  whatsapp_click: Phone,
  showreel_click: Video,
  showreel_play: Video,
  showreel_complete: Video,
};

const DEVICE_ICONS: Record<string, React.ElementType> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

function SkeletonCard() {
  return (
    <div className="p-4 bg-primary/5 border border-primary/10 animate-pulse">
      <div className="h-3 w-20 bg-primary/10 mb-3 rounded" />
      <div className="h-8 w-16 bg-primary/10 rounded" />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("7d");

  const { data, isLoading, isError, error } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics-dashboard", range],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/summary?range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return await res.json();
    },
  });

  if (isError) {
    return (
      <div className="p-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20">
          <Activity className="text-red-500" size={20} />
          <span className="text-sm text-foreground/80">
            {error instanceof Error ? error.message : "Failed to load analytics data."}
          </span>
        </div>
        <p className="text-xs text-foreground/40 mt-3">
          Make sure you are authenticated and the database is connected.
        </p>
      </div>
    );
  }

  const d = data!;
  const isOverviewLoading = isLoading;
  const isEmpty = !isLoading && d.overview.totalVisits === 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Analytics</h1>
          <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest mt-1">
            Website performance and visitor behavior
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-1 bg-primary/5 border border-primary/10 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                range === opt.value
                  ? "bg-accent text-background"
                  : "text-foreground/50 hover:text-foreground hover:bg-primary/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
          <BarChart3 size={18} />
          Overview
        </h2>

        {isOverviewLoading ? (
          <OverviewSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} className="text-cyan-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Total Visits</span>
              </div>
              <p className="text-2xl font-display font-bold text-cyan-400">{d.overview.totalVisits}</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-blue-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Unique Visitors</span>
              </div>
              <p className="text-2xl font-display font-bold text-blue-400">{d.overview.uniqueVisitors}</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Visits Today</span>
              </div>
              <p className="text-2xl font-display font-bold text-emerald-400">{d.overview.visitsToday}</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MousePointerClick size={14} className="text-purple-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Project Views</span>
              </div>
              <p className="text-2xl font-display font-bold text-purple-400">{d.overview.projectDetailViews}</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-pink-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Contact Actions</span>
              </div>
              <p className="text-2xl font-display font-bold text-pink-400">{d.overview.contactActions}</p>
            </div>
          </div>
        )}

        {/* Overview Bottom Row: Top Project + Top Referrer */}
        {!isOverviewLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <StarDisplay />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Top Project</span>
              </div>
              {d.overview.topProject ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate">{d.overview.topProject.title}</span>
                  <span className="text-xs text-foreground/50 shrink-0 ml-2">{d.overview.topProject.views} views</span>
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No project views yet</p>
              )}
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={14} className="text-amber-400" />
                <span className="text-[9px] font-bold uppercase text-foreground/40">Top Referrer</span>
              </div>
              {d.overview.topReferrer ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate">{d.overview.topReferrer.domain}</span>
                  <span className="text-xs text-foreground/50 shrink-0 ml-2">{d.overview.topReferrer.count}</span>
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No referrer data yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="p-12 bg-primary/5 border border-primary/10 text-center">
          <BarChart3 size={40} className="mx-auto mb-4 text-foreground/20" />
          <p className="text-sm font-bold uppercase tracking-wider text-foreground/60">
            No analytics data yet
          </p>
          <p className="text-xs text-foreground/40 mt-2 max-w-md mx-auto leading-relaxed">
            Analytics data will appear after real visitors browse the public site.
            Visit the homepage, projects, and contact page to generate data.
          </p>
        </div>
      )}

      {!isEmpty && !isLoading && (
        <>
          {/* Traffic Trend */}
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
              <TrendingUp size={18} />
              Traffic Trend
            </h2>
            <div className="p-6 bg-primary/5 border border-primary/10">
              {d.trend.length > 0 ? (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.trend} margin={{ bottom: 20, left: 0, right: 0, top: 10 }}>
                      <XAxis
                        dataKey="date"
                        stroke="#ffffff40"
                        fontSize={9}
                        tickFormatter={(val: string) => {
                          const d2 = new Date(val + "T00:00:00");
                          return d2.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                        }}
                      />
                      <YAxis stroke="#ffffff40" fontSize={9} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69", borderRadius: 0 }}
                        labelFormatter={(val: unknown) => {
                          const d = typeof val === "string" ? new Date(val + "T00:00:00") : new Date(String(val) + "T00:00:00");
                          return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
                        }}
                      />
                      <Bar dataKey="visits" name="Visits" radius={[2, 2, 0, 0]} barSize={range === "24h" ? 40 : range === "7d" ? 32 : 20}>
                        {d.trend.map((_, idx) => (
                          <Cell key={idx} fill={idx === d.trend.length - 1 ? "#00F5D4" : "#00F5D480"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic text-center py-8">No visits in this period.</p>
              )}
            </div>
          </div>

          {/* Top Pages & Top Projects side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <Eye size={18} />
                Top Pages
              </h2>
              {d.topPages.length > 0 ? (
                <div className="space-y-2">
                  {d.topPages.map((p, i) => (
                    <div key={p.path} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-bold text-foreground/30 w-5 shrink-0">{i + 1}.</span>
                        <span className="text-sm font-bold truncate">{p.path}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-foreground/50">{p.uniqueVisitors} unique</span>
                        <span className="text-sm font-display font-bold text-accent">{p.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No page view data yet.</p>
              )}
            </div>

            {/* Top Projects */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <ArrowUpRight size={18} />
                Top Projects
              </h2>
              {d.topProjects.length > 0 ? (
                <div className="space-y-2">
                  {d.topProjects.map((p, i) => (
                    <div key={p.slug || i} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-bold text-foreground/30 w-5 shrink-0">{i + 1}.</span>
                        <span className="text-sm font-bold truncate">{p.title || p.slug}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-foreground/50">{p.uniqueVisitors} unique</span>
                        <span className="text-sm font-display font-bold text-accent">{p.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No project view data yet.</p>
              )}
            </div>
          </div>

          {/* Conversion Actions & Device Breakdown side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Conversion Actions */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <MousePointerClick size={18} />
                Conversion Actions
              </h2>
              {d.conversions.length > 0 ? (
                <div className="space-y-2">
                  {d.conversions.map((c) => {
                    const Icon = CONVERSION_ICONS[c.event] || MousePointerClick;
                    return (
                      <div key={c.event} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3">
                          <Icon size={14} className="text-accent shrink-0" />
                          <span className="text-sm font-bold">{CONVERSION_LABELS[c.event] || c.event}</span>
                        </div>
                        <span className="text-sm font-display font-bold text-accent">{c.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No conversion events yet.</p>
              )}
            </div>

            {/* Device Breakdown */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <Monitor size={18} />
                Device Breakdown
              </h2>
              {d.devices.length > 0 ? (
                <div className="space-y-2">
                  {d.devices.map((dev) => {
                    const Icon = DEVICE_ICONS[dev.type] || Monitor;
                    return (
                      <div key={dev.type} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3">
                          <Icon size={14} className="text-foreground/60 shrink-0" />
                          <span className="text-sm font-bold capitalize">{dev.type}</span>
                        </div>
                        <span className="text-sm font-display font-bold text-accent">{dev.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No device data yet.</p>
              )}
            </div>
          </div>

          {/* Referrers & Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Referrer Sources */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <Globe size={18} />
                Referrer Sources
              </h2>
              {d.referrers.length > 0 ? (
                <div className="space-y-2">
                  {d.referrers.map((r) => (
                    <div key={r.domain} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10">
                      <span className="text-sm font-bold truncate">{r.domain}</span>
                      <span className="text-sm font-display font-bold text-accent shrink-0 ml-2">{r.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No referrer data yet.</p>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                <Clock size={18} />
                Recent Activity
              </h2>
              {d.recentEvents.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {d.recentEvents.map((e) => (
                    <div key={e._id} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          e.type === "page_view" ? "bg-cyan-400" : "bg-purple-400"
                        }`} />
                        <span className="text-xs font-bold truncate">
                          {CONVERSION_LABELS[e.interactionType || e.type] || e.interactionType || e.type}
                        </span>
                        <span className="text-[10px] text-foreground/40 truncate hidden sm:inline">
                          {e.page}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        {e.deviceType && (
                          <span className="text-[10px] text-foreground/30 uppercase">{e.deviceType}</span>
                        )}
                        <span className="text-[10px] text-foreground/40">
                          {timeAgo(e.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/40 italic">No recent events.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StarDisplay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}