"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  Briefcase,
  DollarSign,
  Mail,
  MessageSquare,
  Phone,
  Trophy,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import { computeClientHealth } from "@/lib/insights";
import { buildPeriodReport } from "@/lib/reports";
import type { Client, Deal, Expense, Interaction } from "@/types/database";

type TimelineEvent = {
  id: string;
  date: string;
  kind: "interaction" | "expense" | "deal";
  title: string;
  subtitle?: string;
  amountCents?: number;
  activityType?: string;
  dealStatus?: string;
};

const activityIcons: Record<string, typeof Mail> = {
  lunch: Utensils,
  dinner: Utensils,
  golf: Trophy,
  meeting: MessageSquare,
  call: Phone,
  email: Mail,
  other: MessageSquare,
};

function buildEvents(
  interactions: Interaction[],
  expenses: Expense[],
  deals: Deal[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    ...interactions.map((i) => ({
      id: `i-${i.id}`,
      date: i.occurred_at,
      kind: "interaction" as const,
      title: i.title,
      subtitle: `${i.duration_minutes} min`,
      activityType: i.activity_type,
    })),
    ...expenses.map((e) => ({
      id: `e-${e.id}`,
      date: e.incurred_at,
      kind: "expense" as const,
      title: e.description ?? e.category,
      subtitle: e.category,
      amountCents: e.amount_cents,
    })),
    ...deals.map((d) => ({
      id: `d-${d.id}`,
      date: d.closed_at ?? d.created_at,
      kind: "deal" as const,
      title: d.title,
      subtitle: d.status,
      amountCents: d.amount_cents,
      dealStatus: d.status,
    })),
  ];

  return events.sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
}

export function ClientRelationshipTimeline({
  client,
  interactions,
  expenses,
  deals,
}: {
  client: Client;
  interactions: Interaction[];
  expenses: Expense[];
  deals: Deal[];
}) {
  const year = new Date().getFullYear();
  const report = buildPeriodReport({
    year,
    clients: [client],
    interactions,
    expenses,
    deals,
  });
  const lastInteraction = interactions[0];
  const health = computeClientHealth(
    report.clientSummaries[0] ?? {
      clientId: client.id,
      clientName: client.name,
      company: client.company,
      interactionCount: 0,
      totalMinutes: 0,
      totalExpenseCents: 0,
      closedRevenueCents: 0,
      pipelineRevenueCents: 0,
    },
    lastInteraction
  );

  const events = buildEvents(interactions, expenses, deals);
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, event) => {
    const key = format(parseISO(event.date), "MMMM yyyy");
    acc[key] = acc[key] ?? [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Health</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{health.score}</p>
            <Badge className="mt-2" variant="secondary">{health.tier}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Touchpoints</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{interactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Invested</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">
              {formatCurrency(report.totalExpenseCents, { compact: true })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Closed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {formatCurrency(report.closedRevenueCents, { compact: true })}
            </p>
          </CardContent>
        </Card>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-slate-500">No relationship history yet.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {month}
              </h3>
              <div className="relative space-y-0 border-l-2 border-indigo-100 pl-6">
                {monthEvents.map((event) => {
                  const Icon =
                    event.kind === "deal"
                      ? Briefcase
                      : event.kind === "expense"
                        ? DollarSign
                        : activityIcons[event.activityType ?? "other"] ?? MessageSquare;

                  return (
                    <div key={event.id} className="relative pb-6 last:pb-0">
                      <span className="absolute -left-[1.6rem] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm">
                        <Icon className="h-3 w-3" aria-hidden />
                      </span>
                      <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900">{event.title}</p>
                            <p className="text-xs text-slate-500">
                              {format(parseISO(event.date), "MMM d, yyyy")}
                              {event.subtitle ? ` · ${event.subtitle}` : ""}
                            </p>
                          </div>
                          {event.amountCents !== undefined ? (
                            <span
                              className={
                                event.kind === "expense"
                                  ? "text-sm font-semibold text-rose-600"
                                  : "text-sm font-semibold text-emerald-600"
                              }
                            >
                              {event.kind === "expense" ? "−" : "+"}
                              {formatCurrency(event.amountCents)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href={`/log?client=${client.id}`}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Log touchpoint
          </Link>
          <Link
            href="/expenses"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add expense
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
