"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight, Minus } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { ClientSummary } from "@/types/database";

function CompareContent({
  clients,
  summaries,
}: {
  clients: { id: string; name: string; company: string | null }[];
  summaries: ClientSummary[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keys = ["a", "b", "c"] as const;
  const selected = keys
    .map((k) => searchParams.get(k))
    .filter((id): id is string => Boolean(id));

  function toggleClient(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = keys.map((k) => params.get(k)).filter(Boolean) as string[];

    if (current.includes(id)) {
      const idx = current.indexOf(id);
      params.delete(keys[idx]);
    } else if (current.length < 3) {
      const emptyKey = keys.find((k) => !params.get(k));
      if (emptyKey) params.set(emptyKey, id);
    }
    router.push(`/compare?${params.toString()}`);
  }

  const selectedSummaries = selected
    .map((id) => summaries.find((s) => s.clientId === id))
    .filter(Boolean) as ClientSummary[];

  const metrics = [
    {
      label: "Touchpoints",
      get: (s: ClientSummary) => String(s.interactionCount),
    },
    {
      label: "Time invested",
      get: (s: ClientSummary) =>
        `${Math.round(s.totalMinutes / 60)}h ${s.totalMinutes % 60}m`,
    },
    {
      label: "Expenses",
      get: (s: ClientSummary) => formatCurrency(s.totalExpenseCents),
      tone: "expense" as const,
    },
    {
      label: "Closed revenue",
      get: (s: ClientSummary) => formatCurrency(s.closedRevenueCents),
      tone: "revenue" as const,
    },
    {
      label: "Pipeline",
      get: (s: ClientSummary) => formatCurrency(s.pipelineRevenueCents),
    },
    {
      label: "ROI",
      get: (s: ClientSummary) => {
        if (s.totalExpenseCents === 0) return s.closedRevenueCents > 0 ? "∞" : "—";
        const roi = Math.round(
          ((s.closedRevenueCents - s.totalExpenseCents) / s.totalExpenseCents) * 100
        );
        return `${roi >= 0 ? "+" : ""}${roi}%`;
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compare clients"
        description="Select up to 3 clients for side-by-side ROI analysis"
      />

      <div className="flex flex-wrap gap-2">
        {clients.map((client) => {
          const isSelected = selected.includes(client.id);
          return (
            <button
              key={client.id}
              type="button"
              onClick={() => toggleClient(client.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {client.name}
            </button>
          );
        })}
      </div>

      {selectedSummaries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-500">Select clients above to compare their ROI.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-200 p-4 text-left text-sm font-medium text-slate-500">
                  Metric
                </th>
                {selectedSummaries.map((s) => (
                  <th
                    key={s.clientId}
                    className="border-b border-slate-200 p-4 text-left text-sm font-semibold text-slate-900"
                  >
                    <Link
                      href={`/clients/${s.clientId}`}
                      className="hover:text-indigo-600"
                    >
                      {s.clientName}
                    </Link>
                    {s.company ? (
                      <p className="mt-0.5 text-xs font-normal text-slate-500">{s.company}</p>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.label} className="even:bg-slate-50/50">
                  <td className="border-b border-slate-100 p-4 text-sm font-medium text-slate-600">
                    {metric.label}
                  </td>
                  {selectedSummaries.map((s) => (
                    <td
                      key={s.clientId}
                      className={`border-b border-slate-100 p-4 text-sm font-semibold tabular-nums ${
                        metric.tone === "revenue"
                          ? "text-emerald-600"
                          : metric.tone === "expense"
                            ? "text-rose-600"
                            : "text-slate-900"
                      }`}
                    >
                      {metric.get(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSummaries.length >= 2 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick verdict</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            {(() => {
              const best = [...selectedSummaries].sort(
                (a, b) => b.closedRevenueCents - a.closedRevenueCents
              )[0];
              const mostActive = [...selectedSummaries].sort(
                (a, b) => b.interactionCount - a.interactionCount
              )[0];
              return (
                <>
                  <p className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" aria-hidden />
                    <strong>{best.clientName}</strong> leads in closed revenue (
                    {formatCurrency(best.closedRevenueCents, { compact: true })})
                  </p>
                  <p className="flex items-center gap-1">
                    <Minus className="h-4 w-4 text-indigo-600" aria-hidden />
                    <strong>{mostActive.clientName}</strong> has the most touchpoints (
                    {mostActive.interactionCount})
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export function ComparePageClient({
  clients,
  summaries,
}: {
  clients: { id: string; name: string; company: string | null }[];
  summaries: ClientSummary[];
}) {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <CompareContent clients={clients} summaries={summaries} />
    </Suspense>
  );
}
