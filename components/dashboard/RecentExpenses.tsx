"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { Client, Expense } from "@/types/database";

export function RecentExpenses({
  expenses,
  clients,
}: {
  expenses: Expense[];
  clients: Client[];
}) {
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const recent = expenses.slice(0, 6);

  if (recent.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Recent expenses</h2>
        <Link href="/expenses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View all
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {recent.map((exp) => (
          <li key={exp.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {exp.description ?? exp.category}
              </p>
              <p className="truncate text-xs text-slate-500">
                {clientMap.get(exp.client_id)?.name ?? "Unknown"} ·{" "}
                {format(parseISO(exp.incurred_at), "MMM d")}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-rose-600">
              −{formatCurrency(exp.amount_cents, { compact: true })}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
