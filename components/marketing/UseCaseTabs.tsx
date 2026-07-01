"use client";

import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  PenLine,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const useCases = [
  {
    id: "log",
    label: "Log touchpoints",
    icon: PenLine,
    title: "Capture every client interaction",
    description:
      "Log lunches, dinners, golf outings, and meetings in seconds. Attach expenses and deal value at the same time — manual entry, voice memo, or calendar sync.",
    stats: ["7 activity types", "Voice memo upload", "Expense linking"],
  },
  {
    id: "track",
    label: "Track spend",
    icon: Receipt,
    title: "See what relationships actually cost",
    description:
      "Meals, entertainment, travel, and gifts roll up per client and per quarter. No more spreadsheet archaeology before your QBR.",
    stats: ["Category breakdown", "Per-client totals", "Quarterly rollups"],
  },
  {
    id: "pipeline",
    label: "Pipeline & deals",
    icon: Briefcase,
    title: "Connect time invested to revenue",
    description:
      "Track pipeline, closed, and lost deals alongside your relationship spend. Know which clients are worth the golf membership.",
    stats: ["Deal board", "Status tracking", "ROI by client"],
  },
  {
    id: "reports",
    label: "Quarterly ROI",
    icon: BarChart3,
    title: "Reports that justify the spend",
    description:
      "Quarterly and yearly rollups with revenue vs. expense charts, client breakdowns, and CSV export for finance.",
    stats: ["Q/Y toggles", "Client P&L", "CSV export"],
  },
  {
    id: "insights",
    label: "Client health",
    icon:  Users,
    title: "Know who needs attention",
    description:
      "Health scores, follow-up reminders, and activity breakdowns surface at-risk relationships before deals go cold.",
    stats: ["Health scores", "Stale alerts", "Activity mix"],
  },
  {
    id: "roi",
    label: "Prove ROI",
    icon: TrendingUp,
    title: "Turn relationship spend into pipeline proof",
    description:
      "Compare clients side-by-side, track quarter-over-quarter trends, and build the case for your entertainment budget.",
    stats: ["Client compare", "QoQ deltas", "Leaderboard"],
  },
];

export function UseCaseTabs() {
  const [active, setActive] = useState(useCases[0].id);
  const current = useCases.find((u) => u.id === active) ?? useCases[0];
  const Icon = current.icon;

  return (
    <section id="use-cases" className="py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Use cases
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ship insights that actually move pipeline
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          From the first lunch to the signed contract — every touchpoint rolls into
          a client P&amp;L you can actually use.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {useCases.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
              active === id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <TabIcon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900">{current.title}</h3>
            <p className="mt-4 text-slate-600 leading-relaxed">{current.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {current.stats.map((stat) => (
                <li
                  key={stat}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
          <div className="gradient-mesh flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-sm space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4
                  rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur transition-transform hover:scale-[1.02]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-3/4 rounded bg-slate-200" />
                    <div className="h-2 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
