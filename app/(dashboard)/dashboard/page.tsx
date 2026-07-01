import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildPeriodReport, formatMoney } from "@/lib/reports";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const year = new Date().getFullYear();
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;

  const [clients, interactions, expenses, deals] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
    listExpenses(user.id),
    listDeals(user.id),
  ]);

  const quarterly = buildPeriodReport({
    year,
    quarter,
    clients,
    interactions,
    expenses,
    deals,
  });

  const recent = interactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Current quarter: {quarterly.periodLabel}
          </p>
        </div>
        <Link
          href="/log"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          Log activity
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Clients" value={String(clients.length)} />
        <Metric
          label="Q time"
          value={`${Math.round(quarterly.totalMinutes / 60)}h`}
        />
        <Metric label="Q expenses" value={formatMoney(quarterly.totalExpenseCents)} />
        <Metric
          label="Q closed revenue"
          value={formatMoney(quarterly.closedRevenueCents)}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <Link href="/reports" className="text-sm text-sky-400 hover:text-sky-300">
            View reports
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-500">
            No activities yet.{" "}
            <Link href="/log" className="text-sky-400 hover:text-sky-300">
              Log your first client touchpoint
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
            {recent.map((item) => {
              const client = clients.find((c) => c.id === item.client_id);
              return (
                <li key={item.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-xs text-zinc-500">
                      {client?.name ?? "Unknown client"} ·{" "}
                      {new Date(item.occurred_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge tone="info">{item.activity_type}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
