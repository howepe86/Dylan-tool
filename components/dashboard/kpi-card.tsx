import type { LucideIcon } from "lucide-react";

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
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: KpiTone;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-slate-400" aria-hidden /> : null}
      </div>
      <p className={cn("mt-2 text-2xl font-semibold tracking-tight", toneStyles[tone])}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
