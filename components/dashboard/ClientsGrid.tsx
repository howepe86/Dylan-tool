"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { ClientHealth } from "@/lib/insights";
import { cn } from "@/lib/utils";

type SortKey = "name" | "health" | "revenue" | "contact";

const tierStyles = {
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-indigo-50 text-indigo-700 border-indigo-200",
  fair: "bg-amber-50 text-amber-700 border-amber-200",
  "at-risk": "bg-rose-50 text-rose-700 border-rose-200",
};

export function ClientsGrid({
  clients,
  healthScores,
}: {
  clients: { id: string; name: string; company: string | null; email: string | null }[];
  healthScores: ClientHealth[];
}) {
  const [sort, setSort] = useState<SortKey>("health");

  const healthMap = useMemo(
    () => new Map(healthScores.map((h) => [h.clientId, h])),
    [healthScores]
  );

  const sorted = useMemo(() => {
    return [...clients].sort((a, b) => {
      const ha = healthMap.get(a.id);
      const hb = healthMap.get(b.id);
      switch (sort) {
        case "health":
          return (hb?.score ?? 0) - (ha?.score ?? 0);
        case "revenue":
          return (hb?.closedRevenueCents ?? 0) - (ha?.closedRevenueCents ?? 0);
        case "contact":
          return (ha?.daysSinceContact ?? 999) - (hb?.daysSinceContact ?? 999);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [clients, healthMap, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-slate-400" aria-hidden />
        {(
          [
            { key: "health" as const, label: "Health score" },
            { key: "revenue" as const, label: "Revenue" },
            { key: "contact" as const, label: "Last contact" },
            { key: "name" as const, label: "Name" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSort(key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
              sort === key
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((client) => {
          const health = healthMap.get(client.id);
          return (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="group h-full transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                      {client.name}
                    </h2>
                    {health ? (
                      <Badge className={cn("shrink-0 border text-xs", tierStyles[health.tier])}>
                        {health.score}
                      </Badge>
                    ) : null}
                  </div>
                  {client.company ? (
                    <p className="mt-1 text-sm text-slate-500">{client.company}</p>
                  ) : null}
                  {health ? (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{health.interactionCount} touchpoints</span>
                      <span className="text-emerald-600">
                        {formatCurrency(health.closedRevenueCents, { compact: true })} closed
                      </span>
                      {health.daysSinceContact !== null ? (
                        <span
                          className={
                            health.daysSinceContact > 30 ? "text-amber-600" : undefined
                          }
                        >
                          {health.daysSinceContact === 0
                            ? "Today"
                            : `${health.daysSinceContact}d ago`}
                        </span>
                      ) : (
                        <span className="text-rose-500">No contact</span>
                      )}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
