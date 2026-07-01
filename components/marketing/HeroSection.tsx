"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12 lg:pb-28 lg:pt-20">
      <div className="gradient-mesh absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-100/40 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-4xl text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Client relationship ROI platform
        </div>

        <h1 className="animate-fade-up-delay-1 mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Know what client time{" "}
          <span className="text-gradient">costs — and earns</span>
        </h1>

        <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Log lunches, golf outings, and meetings. Track expenses, pipeline, and
          closed revenue — then see quarterly ROI by client in one clean dashboard.
        </p>

        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-indigo-200">
            <Link href="/login">
              Try live demo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          No credit card · One-click demo with sample data
        </p>
      </div>

      <div className="animate-fade-up-delay-3 relative mx-auto mt-16 max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-indigo-100/50">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-slate-400">ClientLedger — Q2 Dashboard</span>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-4">
            {[
              { label: "Revenue", value: "$284K", tone: "text-emerald-600 bg-emerald-50" },
              { label: "Expenses", value: "$12.4K", tone: "text-rose-600 bg-rose-50" },
              { label: "Net ROI", value: "+2,192%", tone: "text-indigo-600 bg-indigo-50" },
              { label: "Pipeline", value: "$120K", tone: "text-slate-700 bg-slate-100" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className={`mt-1 text-2xl font-bold ${kpi.tone.split(" ")[0]}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mx-6 mb-6 flex h-32 items-end gap-2 rounded-xl bg-gradient-to-t from-indigo-50 to-transparent px-4 pb-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 opacity-80 transition-all hover:opacity-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute -right-4 -top-4 hidden animate-float rounded-xl border border-slate-200 bg-white p-4 shadow-lg lg:block">
          <p className="text-xs font-medium text-slate-500">Client health</p>
          <p className="mt-1 text-lg font-bold text-emerald-600">Sarah Chen · 92</p>
        </div>

        <div className="absolute -bottom-4 -left-4 hidden animate-float rounded-xl border border-slate-200 bg-white p-4 shadow-lg lg:block" style={{ animationDelay: "1s" }}>
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-indigo-600" aria-hidden />
            <p className="text-sm font-medium text-slate-700">3 follow-ups due</p>
          </div>
        </div>
      </div>
    </section>
  );
}
