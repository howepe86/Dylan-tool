"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ActivityBreakdown } from "@/lib/insights";

export function ActivityBreakdownChart({ data }: { data: ActivityBreakdown[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">No activities in this period</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280} aria-label="Activity breakdown chart">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          }}
          formatter={(value, name) => [
            name === "count" ? `${value} activities` : `${value} min`,
            name === "count" ? "Count" : "Time",
          ]}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
