import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

type KpiTone = "neutral" | "revenue" | "expense";

const toneStyles: Record<KpiTone, string> = {
  neutral: "text-slate-900",
  revenue: "text-emerald-600",
  expense: "text-rose-600",
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  delta,
  deltaLabel,
  invertDelta,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: KpiTone;
  delta?: number | null;
  deltaLabel?: string;
  invertDelta?: boolean;
}) {
  const showDelta = delta !== null && delta !== undefined;
  const isPositive = invertDelta ? (delta ?? 0) < 0 : (delta ?? 0) > 0;
  const isNegative = invertDelta ? (delta ?? 0) > 0 : (delta ?? 0) < 0;
  const isNeutral = delta === 0;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon ? (
          <div className="rounded-lg bg-slate-50 p-1.5 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        ) : null}
      </div>
      <p className={cn("mt-2 text-2xl font-bold tracking-tight", toneStyles[tone])}>
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {showDelta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              isNeutral && "text-slate-500",
              isPositive && "text-emerald-600",
              isNegative && "text-rose-600"
            )}
          >
            {isNeutral ? (
              <Minus className="h-3 w-3" aria-hidden />
            ) : isPositive ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden />
            )}
            {isNeutral ? "0%" : `${Math.abs(delta)}%`}
            {deltaLabel ? (
              <span className="font-normal text-slate-400">{deltaLabel}</span>
            ) : null}
          </span>
        ) : null}
        {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}
