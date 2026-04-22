"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface StatsChartProps {
  data: { _id: string; count: number }[];
  title: string;
}

export default function StatsChart({ data, title }: StatsChartProps) {
  const safeData = Array.isArray(data) ? data : [];
  const chartData = safeData.map(item => ({
    name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    views: item.count
  }));

  return (
    <div className="p-8 bg-primary/5 border border-primary/10 w-full h-[400px]">
      <h3 className="text-xl font-display font-bold mb-8 uppercase tracking-tight">{title}</h3>
      <div className="w-full h-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff40" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0A0A0F", border: "1px solid #2D1B69", fontSize: "12px" }}
              itemStyle={{ color: "#00F5D4" }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#00F5D4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
