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
import { Card } from "@/components/ui/card";
import type { Client, Interaction } from "@/types/database";

export function ActivityCalendar({
  interactions,
  clients,
}: {
  interactions: Interaction[];
  clients: Client[];
}) {
  const [current, setCurrent] = useState(new Date());
  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
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

  const selectedKey = format(current, "yyyy-MM-dd");
  const selectedActivities = dayActivities.get(selectedKey) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
          }
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {format(current, "MMMM yyyy")}
        </h2>
        <button
          type="button"
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
          }
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
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
            if (!day) return <div key={`pad-${i}`} />;
            const key = format(day, "yyyy-MM-dd");
            const count = dayActivities.get(key)?.length ?? 0;
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, current);
            const inMonth = isSameMonth(day, current);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrent(day)}
                className={`relative flex min-h-[72px] flex-col items-center rounded-lg p-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : isToday
                      ? "bg-indigo-50 text-indigo-700"
                      : inMonth
                        ? "hover:bg-slate-50 text-slate-900"
                        : "text-slate-300"
                }`}
              >
                <span className="font-medium">{format(day, "d")}</span>
                {count > 0 ? (
                  <span
                    className={`mt-1 rounded-full px-1.5 text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      {selectedActivities.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            {format(current, "MMMM d, yyyy")} — {selectedActivities.length} activities
          </p>
          {selectedActivities.map((item) => (
            <Link
              key={item.id}
              href={`/clients/${item.client_id}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-indigo-200"
            >
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">
                  {clientMap.get(item.client_id)?.name}
                </p>
              </div>
              <Badge variant="secondary">{item.activity_type}</Badge>
            </Link>
          ))}
        </div>
      ) : null}
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
        description="Visual overview of client touchpoints"
      />
      <ActivityCalendar interactions={interactions} clients={clients} />
    </div>
  );
}
