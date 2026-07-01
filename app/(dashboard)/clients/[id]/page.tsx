import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import {
  getClient,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildPeriodReport, formatMoney } from "@/lib/reports";
import { createClient } from "@/lib/supabase-server";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const client = await getClient(user.id, id);
  if (!client) notFound();

  const [interactions, expenses, deals] = await Promise.all([
    listInteractions(user.id, id),
    listExpenses(user.id, id),
    listDeals(user.id, id),
  ]);

  const year = new Date().getFullYear();
  const report = buildPeriodReport({
    year,
    clients: [client],
    interactions,
    expenses,
    deals,
  });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/clients" className="text-sm text-zinc-400 hover:text-white">
          ← Back to clients
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-white">{client.name}</h1>
        {client.company ? (
          <p className="text-sm text-zinc-400">{client.company}</p>
        ) : null}
        {client.notes ? (
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">{client.notes}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label={`${year} hours`} value={`${(report.totalMinutes / 60).toFixed(1)}h`} />
        <Metric label={`${year} expenses`} value={formatMoney(report.totalExpenseCents)} />
        <Metric
          label={`${year} closed revenue`}
          value={formatMoney(report.closedRevenueCents)}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Activities</h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-zinc-500">No activities logged yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
            {interactions.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(item.occurred_at).toLocaleString()} ·{" "}
                      {item.duration_minutes} min · {item.input_source}
                    </p>
                  </div>
                  <Badge tone="info">{item.activity_type}</Badge>
                </div>
              </li>
            ))}
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
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
