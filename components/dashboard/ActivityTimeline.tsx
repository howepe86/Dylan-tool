"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Clock, Filter } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ACTIVITY_TYPES } from "@/lib/reports";
import type { ActivityType, Client, Interaction } from "@/types/database";

export function ActivityTimeline({
  interactions,
  clients,
}: {
  interactions: Interaction[];
  clients: Client[];
}) {
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? interactions
        : interactions.filter((i) => i.activity_type === filter),
    [interactions, filter]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, Interaction[]> = {};
    for (const item of filtered) {
      const key = format(parseISO(item.occurred_at), "MMMM d, yyyy");
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return Object.entries(groups);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" aria-hidden />
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        {ACTIVITY_TYPES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">
          No activities match this filter.
        </Card>
      ) : (
        grouped.map(([date, items]) => (
          <div key={date}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {date}
            </p>
            <div className="space-y-2">
              {items.map((item) => {
                const client = clientMap.get(item.client_id);
                return (
                  <Link
                    key={item.id}
                    href={`/clients/${item.client_id}`}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Clock className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <Badge variant="secondary">{item.activity_type}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {client?.name ?? "Unknown"}
                        {client?.company ? ` · ${client.company}` : ""}
                      </p>
                      {item.notes ? (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.notes}</p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-400">
                      <p>{format(parseISO(item.occurred_at), "h:mm a")}</p>
                      {item.duration_minutes > 0 ? (
                        <p className="mt-0.5">{item.duration_minutes}m</p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function ActivityTimelinePage({
  interactions,
  clients,
}: {
  interactions: Interaction[];
  clients: Client[];
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity timeline"
        description={`${interactions.length} touchpoints across ${clients.length} clients`}
      />
      <ActivityTimeline interactions={interactions} clients={clients} />
    </div>
  );
}
