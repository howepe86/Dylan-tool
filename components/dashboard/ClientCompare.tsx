"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, GitCompare, Minus, TrendingDown } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format/currency";
import type { ClientSummary } from "@/types/database";

function CompareColumn({
  summary,
  label,
}: {
  summary: ClientSummary | undefined;
  label: string;
}) {
  if (!summary) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardContent className="flex h-72 items-center justify-center text-sm text-slate-400">
          Select a client
        </CardContent>
      </Card>
    );
  }

  const roi =
    summary.totalExpenseCents > 0
      ? Math.round(
          ((summary.closedRevenueCents - summary.totalExpenseCents) /
            summary.totalExpenseCents) *
            100
        )
      : summary.closedRevenueCents > 0
        ? null
        : null;

  const rows = [
    { label: "Touchpoints", value: String(summary.interactionCount) },
    {
      label: "Time invested",
      value: `${Math.floor(summary.totalMinutes / 60)}h ${summary.totalMinutes % 60}m`,
    },
    {
      label: "Expenses",
      value: formatCurrency(summary.totalExpenseCents),
      tone: "text-rose-600",
    },
    {
      label: "Closed revenue",
      value: formatCurrency(summary.closedRevenueCents),
      tone: "text-emerald-600",
    },
    {
      label: "Pipeline",
      value: formatCurrency(summary.pipelineRevenueCents),
      tone: "text-indigo-600",
    },
    {
      label: "Net ROI",
      value:
        summary.totalExpenseCents === 0
          ? summary.closedRevenueCents > 0
            ? "∞"
            : "—"
          : `${roi !== null && roi >= 0 ? "+" : ""}${roi}%`,
      tone:
        roi !== null && roi >= 0
          ? "text-emerald-600"
          : roi !== null
            ? "text-rose-600"
            : "text-slate-900",
    },
  ];

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="bg-gradient-to-br from-indigo-50/80 to-white pb-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </CardTitle>
        <Link
          href={`/clients/${summary.clientId}`}
          className="text-lg font-bold text-slate-900 hover:text-indigo-600"
        >
          {summary.clientName}
        </Link>
        {summary.company ? (
          <p className="text-sm text-slate-500">{summary.company}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0"
          >
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className={`text-sm font-semibold tabular-nums ${row.tone ?? "text-slate-900"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ClientCompareClient({
  summaries,
  periodLabel,
}: {
  summaries: ClientSummary[];
  periodLabel: string;
}) {
  const [clientA, setClientA] = useState<string>("");
  const [clientB, setClientB] = useState<string>("");
  const [clientC, setClientC] = useState<string>("");

  const summaryMap = useMemo(
    () => new Map(summaries.map((s) => [s.clientId, s])),
    [summaries]
  );

  const summaryA = summaryMap.get(clientA);
  const summaryB = summaryMap.get(clientB);
  const summaryC = summaryMap.get(clientC);

  const selected = [summaryA, summaryB, summaryC].filter(Boolean) as ClientSummary[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compare clients"
        description={`Side-by-side ROI analysis for ${periodLabel}`}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <GitCompare className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        {(
          [
            { value: clientA, set: setClientA, placeholder: "Client A" },
            { value: clientB, set: setClientB, placeholder: "Client B" },
            { value: clientC, set: setClientC, placeholder: "Client C (optional)" },
          ] as const
        ).map(({ value, set, placeholder }, i) => (
          <div key={placeholder} className="flex items-center gap-2">
            {i > 0 ? <span className="text-sm font-medium text-slate-300">vs</span> : null}
            <Select value={value} onValueChange={set}>
              <SelectTrigger className="w-44 sm:w-52">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {summaries.map((s) => (
                  <SelectItem
                    key={s.clientId}
                    value={s.clientId}
                    disabled={
                      s.clientId === clientA ||
                      s.clientId === clientB ||
                      s.clientId === clientC
                    }
                  >
                    {s.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {summaries.length < 2 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-500">Add at least two clients to compare.</p>
          <Link href="/clients/new" className="mt-2 inline-block text-sm font-medium text-indigo-600">
            Add a client →
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <CompareColumn summary={summaryA} label="Client A" />
            <CompareColumn summary={summaryB} label="Client B" />
            {clientC ? <CompareColumn summary={summaryC} label="Client C" /> : null}
          </div>

          {selected.length >= 2 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick verdict</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                {(() => {
                  const best = [...selected].sort(
                    (a, b) => b.closedRevenueCents - a.closedRevenueCents
                  )[0];
                  const mostActive = [...selected].sort(
                    (a, b) => b.interactionCount - a.interactionCount
                  )[0];
                  const bestRoi = [...selected]
                    .filter((s) => s.totalExpenseCents > 0)
                    .sort(
                      (a, b) =>
                        (b.closedRevenueCents - b.totalExpenseCents) / b.totalExpenseCents -
                        (a.closedRevenueCents - a.totalExpenseCents) / a.totalExpenseCents
                    )[0];
                  return (
                    <>
                      <p className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                        <span>
                          <strong>{best.clientName}</strong> leads in closed revenue (
                          {formatCurrency(best.closedRevenueCents, { compact: true })})
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Minus className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                        <span>
                          <strong>{mostActive.clientName}</strong> has the most touchpoints (
                          {mostActive.interactionCount})
                        </span>
                      </p>
                      {bestRoi ? (
                        <p className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 shrink-0 rotate-180 text-emerald-600" aria-hidden />
                          <span>
                            <strong>{bestRoi.clientName}</strong> has the best expense ROI
                          </span>
                        </p>
                      ) : null}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
