import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientTimeline } from "@/components/dashboard/ClientTimeline";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const pipelineTotal = deals
    .filter((d) => d.status === "pipeline")
    .reduce((s, d) => s + d.amount_cents, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
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
        <Button variant="outline" asChild>
          <Link href={`/clients/${id}/edit`}>Edit client</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <KpiCard
          label="Pipeline"
          value={formatCurrency(pipelineTotal, { compact: true })}
          hint="Open deals"
        />
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="activities">
            Activities ({interactions.length})
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses ({expenses.length})
          </TabsTrigger>
          <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          <ClientTimeline 
            client={client}
            interactions={interactions}
            expenses={expenses}
            deals={deals}
          />
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
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
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          {expenses.length === 0 ? (
            <p className="text-sm text-slate-500">No expenses for this client.</p>
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-slate-500">
                        {new Date(item.incurred_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.description ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums text-rose-600">
                        −{formatCurrency(item.amount_cents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          {deals.length === 0 ? (
            <p className="text-sm text-slate-500">No deals for this client.</p>
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Closed</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {item.closed_at
                          ? new Date(item.closed_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-700">
                        {formatCurrency(item.amount_cents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
