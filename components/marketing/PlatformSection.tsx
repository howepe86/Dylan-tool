import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Command,
  GitCompare,
  Lightbulb,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  { icon: Search, title: "Command palette", desc: "⌘K to jump anywhere instantly" },
  { icon: Lightbulb, title: "Client health scores", desc: "AI-weighted relationship health" },
  { icon: Calendar, title: "Activity calendar", desc: "Visual month view of touchpoints" },
  { icon: GitCompare, title: "Client comparison", desc: "Side-by-side ROI analysis" },
  { icon: TrendingUp, title: "QoQ trend deltas", desc: "Quarter-over-quarter KPI changes" },
  { icon: Zap, title: "Follow-up reminders", desc: "Stale client alerts on dashboard" },
  { icon: BarChart3, title: "Insights hub", desc: "Activity mix & top performers" },
  { icon: Command, title: "Quick log FAB", desc: "One-tap activity logging" },
  { icon: Sparkles, title: "Activity timeline", desc: "Full chronological feed" },
];

export function PlatformSection() {
  return (
    <section id="features" className="py-20">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Platform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A single, connected platform for client ROI
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Every touchpoint, every expense, every deal — connected so you can
              see the full picture and act before relationships go cold.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/login">
                Explore the demo
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
