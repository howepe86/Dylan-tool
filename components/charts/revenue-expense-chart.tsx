"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format/currency";

export type ChartPoint = {
  label: string;
  revenue: number;
  expenses: number;
};

export function RevenueExpenseChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500"
        aria-label="No chart data for this period"
      >
        No trend data for this period yet.
      </div>
    );
  }

  return (
    <div
      className="h-64 w-full"
      aria-label="Revenue versus expenses trend chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              formatCurrency(value, { compact: true })
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "revenue" ? "Revenue" : "Expenses",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            fill="#ecfdf5"
            strokeWidth={2}
            name="revenue"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#e11d48"
            fill="#fff1f2"
            strokeWidth={2}
            name="expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
