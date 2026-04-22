"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  BarChart3,
  Loader2,
  Users,
  Eye,
  MousePointer2
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

export default function AnalyticsPage() {
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ["business-insights"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/insights");
      return res.json();
    }
  });

  const { data: trafficData } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Analysing Market Data...</div>;

  const { insights, metrics } = insightsData;

  const funnelData = [
    { name: "Total Visitors", value: metrics.totalViews, color: "#2D1B69" },
    { name: "Engagers", value: Math.round(metrics.totalViews * 0.4), color: "#3B2A82" }, // Simulated for UI
    { name: "Prospects", value: Math.round(metrics.totalLeads * 1.5), color: "#00F5D4" }, // Simulated
    { name: "Leads", value: metrics.totalLeads, color: "#00F5D4" }
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Strategic Growth Center</h1>
        <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Business Intelligence & Conversion Insights</p>
      </header>

      {/* High-Level Insights (Actionable) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {insights.map((insight: any, i: number) => (
          <div key={i} className={`p-8 border-l-4 pixel-border ${
            insight.type === 'positive' ? 'bg-green-500/5 border-green-500' :
            insight.type === 'negative' ? 'bg-red-500/5 border-red-500' :
            'bg-accent/5 border-accent'
          }`}>
             <div className="flex items-center space-x-3 mb-6">
                {insight.type === 'positive' ? <CheckCircle size={20} className="text-green-500" /> :
                 insight.type === 'negative' ? <AlertCircle size={20} className="text-red-500" /> :
                 <Zap size={20} className="text-accent" />}
                <h3 className="font-display font-bold uppercase tracking-tight text-sm">{insight.title}</h3>
             </div>
             <p className="text-xs text-foreground/80 leading-relaxed mb-6 italic">"{insight.description}"</p>
             
             <div className="space-y-4 pt-6 border-t border-primary/10">
                <div>
                   <p className="text-[8px] font-bold uppercase text-foreground/40 mb-1">Impact</p>
                   <p className="text-[10px] font-bold uppercase">{insight.impact}</p>
                </div>
                <div>
                   <p className="text-[8px] font-bold uppercase text-accent mb-1">Recommended Action</p>
                   <p className="text-[10px] font-bold uppercase text-accent">{insight.action}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
         {/* Traffic Visualization */}
         <div className="xl:col-span-8 space-y-8">
            {trafficData?.dailyViews && (
              <StatsChart data={trafficData.dailyViews} title="Daily Traffic Momentum" />
            )}

            <div className="p-8 bg-primary/5 border border-primary/10">
               <h3 className="text-xl font-display font-bold mb-8 uppercase tracking-tight">Conversion Funnel</h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={funnelData} margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} width={100} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69" }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
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
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Master KPI</h3>
               <div className="space-y-2">
                  <p className="text-6xl font-display font-bold tracking-tighter">{metrics.globalCR.toFixed(1)}%</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">Avg. Conversion Rate</p>
               </div>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Engagement Metrics</h3>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-primary/10 pb-4">
                     <div>
                        <p className="text-[10px] font-bold uppercase">Showreel Retention</p>
                        <p className="text-[8px] text-foreground/40 uppercase">Completion Rate</p>
                     </div>
                     <p className="text-2xl font-display font-bold">{metrics.completionRate.toFixed(1)}%</p>
                  </div>
                  
                  <div className="flex justify-between items-end border-b border-primary/10 pb-4">
                     <div>
                        <p className="text-[10px] font-bold uppercase">Total Leads</p>
                        <p className="text-[8px] text-foreground/40 uppercase">Lifetime Conversion</p>
                     </div>
                     <p className="text-2xl font-display font-bold">{metrics.totalLeads}</p>
                  </div>

                  <div className="flex justify-between items-end border-b border-primary/10 pb-4">
                     <div>
                        <p className="text-[10px] font-bold uppercase">Unique Traffic</p>
                        <p className="text-[8px] text-foreground/40 uppercase">Page Views (30d)</p>
                     </div>
                     <p className="text-2xl font-display font-bold">{metrics.totalViews}</p>
                  </div>
               </div>

               <div className="pt-4">
                  <button className="w-full py-4 bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background transition-all">
                     Export Full Audit (PDF)
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
