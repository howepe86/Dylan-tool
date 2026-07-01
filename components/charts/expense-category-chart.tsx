"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatCurrency } from "@/lib/format/currency";

const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#94a3b8"];

export function ExpenseCategoryChart({
  data,
}: {
  data: { category: string; amountCents: number }[];
}) {
  const chartData = data
    .filter((d) => d.amountCents > 0)
    .map((d) => ({
      name: d.category.charAt(0).toUpperCase() + d.category.slice(1),
      value: d.amountCents,
    }));

  if (!chartData.length) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">No expenses this period.</p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
