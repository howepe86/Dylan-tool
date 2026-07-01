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

import { formatCurrency } from "@/lib/format/currency";

export type ChartPoint = {
  label: string;
  revenue: number;
  expenses: number;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const revenue = payload.find((p) => p.name === "Revenue")?.value ?? 0;
  const expenses = payload.find((p) => p.name === "Expenses")?.value ?? 0;
  const net = revenue - expenses;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-lg">
      <p className="mb-2 font-medium text-slate-900">{label}</p>
      <div className="space-y-1 text-xs">
        <p className="flex justify-between gap-6">
          <span className="text-slate-500">Revenue</span>
          <span className="font-medium text-emerald-600">{formatCurrency(revenue)}</span>
        </p>
        <p className="flex justify-between gap-6">
          <span className="text-slate-500">Expenses</span>
          <span className="font-medium text-rose-600">{formatCurrency(expenses)}</span>
        </p>
        <p className="flex justify-between gap-6 border-t border-slate-100 pt-1">
          <span className="text-slate-500">Net</span>
          <span className={`font-semibold ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {net >= 0 ? "+" : ""}
            {formatCurrency(net)}
          </span>
        </p>
      </div>
    </div>
  );
}

export function RevenueExpenseChart({ data }: { data: ChartPoint[] }) {
  const hasData = data.some((d) => d.revenue > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <div
        className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500"
        aria-label="No chart data for this period"
      >
        No revenue or expenses logged this period yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full" aria-label="Revenue versus expenses bar chart">
      <div className="mb-4 flex items-center gap-5 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden />
          Revenue
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" aria-hidden />
          Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          barGap={6}
          barCategoryGap="24%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(value) => formatCurrency(value, { compact: true })}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
