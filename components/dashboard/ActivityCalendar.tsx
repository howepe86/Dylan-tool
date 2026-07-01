"use client";

import Link from "next/link";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Client, Interaction } from "@/types/database";

const ACTIVITY_COLORS: Record<string, string> = {
  lunch: "bg-amber-400",
  dinner: "bg-rose-400",
  golf: "bg-emerald-400",
  meeting: "bg-indigo-400",
  call: "bg-sky-400",
  email: "bg-slate-400",
  other: "bg-violet-400",
};

function getInitialMonth(interactions: Interaction[]): Date {
  if (interactions.length === 0) return new Date();
  const latest = interactions.reduce((a, b) =>
    parseISO(a.occurred_at) > parseISO(b.occurred_at) ? a : b
  );
  return startOfMonth(parseISO(latest.occurred_at));
}

export function ActivityCalendar({
  interactions,
  clients,
}: {
  interactions: Interaction[];
  clients: Client[];
}) {
  const [viewMonth, setViewMonth] = useState(() => getInitialMonth(interactions));
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = monthStart.getDay();
  const paddedDays = [...Array(startPad).fill(null), ...days];

  const dayActivities = useMemo(() => {
    const map = new Map<string, Interaction[]>();
    for (const item of interactions) {
      const key = format(parseISO(item.occurred_at), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [interactions]);

  const monthTotal = useMemo(() => {
    let count = 0;
    for (const day of days) {
      count += dayActivities.get(format(day, "yyyy-MM-dd"))?.length ?? 0;
    }
    return count;
  }, [days, dayActivities]);

  const selectedKey = format(selectedDay, "yyyy-MM-dd");
  const selectedActivities = dayActivities.get(selectedKey) ?? [];

  function goToToday() {
    const today = new Date();
    setViewMonth(startOfMonth(today));
    setSelectedDay(today);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
            }
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="min-w-[160px] text-center text-lg font-semibold text-slate-900">
            {format(viewMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={() =>
              setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
            }
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {monthTotal} activit{monthTotal === 1 ? "y" : "ies"} this month
          </span>
          <Button type="button" variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {paddedDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} aria-hidden />;
            const key = format(day, "yyyy-MM-dd");
            const dayItems = dayActivities.get(key) ?? [];
            const count = dayItems.length;
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDay);
            const inMonth = isSameMonth(day, viewMonth);

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  if (!isSameMonth(day, viewMonth)) {
                    setViewMonth(startOfMonth(day));
                  }
                }}
                className={`relative flex min-h-[80px] flex-col items-center rounded-lg p-1.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : isToday
                      ? "bg-indigo-50 ring-1 ring-indigo-200 text-indigo-700"
                      : inMonth
                        ? "hover:bg-slate-50 text-slate-900"
                        : "text-slate-300"
                }`}
              >
                <span className="font-medium">{format(day, "d")}</span>
                {count > 0 ? (
                  <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                    {dayItems.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? "bg-white/80"
                            : ACTIVITY_COLORS[item.activity_type] ?? "bg-indigo-400"
                        }`}
                      />
                    ))}
                    {count > 3 ? (
                      <span
                        className={`text-[9px] font-bold ${isSelected ? "text-white/80" : "text-slate-400"}`}
                      >
                        +{count - 3}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">
          {format(selectedDay, "EEEE, MMMM d, yyyy")}
          {selectedActivities.length > 0
            ? ` — ${selectedActivities.length} activit${selectedActivities.length === 1 ? "y" : "ies"}`
            : ""}
        </p>
        {selectedActivities.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            No activities on this day.{" "}
            <Link href="/log" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log one →
            </Link>
          </Card>
        ) : (
          selectedActivities.map((item) => (
            <Link
              key={item.id}
              href={`/clients/${item.client_id}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">
                  {clientMap.get(item.client_id)?.name}
                  {item.duration_minutes > 0 ? ` · ${item.duration_minutes}m` : ""}
                </p>
              </div>
              <Badge variant="secondary">{item.activity_type}</Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export function CalendarPageClient({
  interactions,
  clients,
}: {
  interactions: Interaction[];
  clients: Client[];
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Calendar"
        description={`${interactions.length} touchpoints across ${clients.length} clients`}
        actions={
          <Link
            href="/log"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Log activity
          </Link>
        }
      />
      <ActivityCalendar interactions={interactions} clients={clients} />
    </div>
  );
}
