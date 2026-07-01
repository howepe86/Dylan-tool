"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GitCompare } from "lucide-react";

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
      <Card className="border-dashed">
        <CardContent className="flex h-64 items-center justify-center text-sm text-slate-400">
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
      : null;

  const rows = [
    { label: "Touchpoints", value: String(summary.interactionCount) },
    {
      label: "Time invested",
      value: `${Math.round(summary.totalMinutes / 60)}h ${summary.totalMinutes % 60}m`,
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
    },
    {
      label: "ROI",
      value: roi !== null ? `${roi >= 0 ? "+" : ""}${roi}%` : "—",
      tone: roi !== null && roi >= 0 ? "text-emerald-600" : "text-rose-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <Link
          href={`/clients/${summary.clientId}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {summary.clientName}
          {summary.company ? ` · ${summary.company}` : ""}
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0"
          >
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className={`text-sm font-semibold ${row.tone ?? "text-slate-900"}`}>
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
}: {
  summaries: ClientSummary[];
}) {
  const [clientA, setClientA] = useState<string>("");
  const [clientB, setClientB] = useState<string>("");

  const summaryA = useMemo(
    () => summaries.find((s) => s.clientId === clientA),
    [summaries, clientA]
  );
  const summaryB = useMemo(
    () => summaries.find((s) => s.clientId === clientB),
    [summaries, clientB]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compare clients"
        description="Side-by-side ROI analysis for Q current period"
      />

      <div className="flex flex-wrap items-center gap-4">
        <GitCompare className="h-5 w-5 text-indigo-600" aria-hidden />
        <Select value={clientA} onValueChange={setClientA}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Client A" />
          </SelectTrigger>
          <SelectContent>
            {summaries.map((s) => (
              <SelectItem key={s.clientId} value={s.clientId} disabled={s.clientId === clientB}>
                {s.clientName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-400">vs</span>
        <Select value={clientB} onValueChange={setClientB}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Client B" />
          </SelectTrigger>
          <SelectContent>
            {summaries.map((s) => (
              <SelectItem key={s.clientId} value={s.clientId} disabled={s.clientId === clientA}>
                {s.clientName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {summaries.length < 2 ? (
        <Card className="p-8 text-center text-sm text-slate-500">
          Add at least two clients with activity to compare.
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <CompareColumn summary={summaryA} label="Client A" />
          <CompareColumn summary={summaryB} label="Client B" />
        </div>
      )}
    </div>
  );
}
