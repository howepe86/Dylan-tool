import Link from "next/link";
import { notFound } from "next/navigation";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuthUser } from "@/lib/auth/session";
import {
  getClient,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { formatCurrency } from "@/lib/format/currency";
import { buildPeriodReport } from "@/lib/reports";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
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
        <Link
          href="/clients"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to clients
        </Link>
        <PageHeader
          title={client.name}
          description={client.company ?? undefined}
        />
        {client.notes ? (
          <p className="max-w-2xl text-sm text-slate-500">{client.notes}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label={`${year} hours`}
          value={`${(report.totalMinutes / 60).toFixed(1)}h`}
        />
        <KpiCard
          label={`${year} expenses`}
          value={formatCurrency(report.totalExpenseCents, { compact: true })}
          tone="expense"
        />
        <KpiCard
          label={`${year} closed revenue`}
          value={formatCurrency(report.closedRevenueCents, { compact: true })}
          tone="revenue"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Activities</h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-slate-500">No activities logged yet.</p>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(item.occurred_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{item.duration_minutes} min</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.activity_type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  );
}
