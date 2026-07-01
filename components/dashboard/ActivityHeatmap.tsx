"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { HeatmapDay } from "@/lib/insights";

const levelColors = [
  "bg-slate-100",
  "bg-indigo-200",
  "bg-indigo-400",
  "bg-indigo-500",
  "bg-indigo-700",
];

export function ActivityHeatmap({ data }: { data: HeatmapDay[] }) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Activity heatmap</p>
        <p className="text-xs text-slate-500">{total} touchpoints · last 13 weeks</p>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1" aria-label="Activity heatmap for last 13 weeks">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${format(parseISO(day.date), "MMM d")}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
                className={cn(
                  "h-3 w-3 rounded-sm transition-colors",
                  levelColors[day.level]
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Less</span>
        {levelColors.map((color, i) => (
          <div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
