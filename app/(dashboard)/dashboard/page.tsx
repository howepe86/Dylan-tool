import Link from "next/link";
import { Activity, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

import { RevenueExpenseChart } from "@/components/charts/revenue-expense-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { formatCurrency } from "@/lib/format/currency";
import { buildMonthlyTrend, buildPeriodReport } from "@/lib/reports";

export default async function DashboardPage() {
  const user = await getAuthUser();
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

  const chartData = buildMonthlyTrend({
    year,
    quarter,
    expenses,
    deals,
  });

  const netCents =
    quarterly.closedRevenueCents - quarterly.totalExpenseCents;
  const recent = interactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Financial overview for ${quarterly.periodLabel}`}
        actions={
          <Button asChild>
            <Link href="/log">Log activity</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total revenue"
          value={formatCurrency(quarterly.closedRevenueCents, { compact: true })}
          hint="Closed deals this quarter"
          icon={TrendingUp}
          tone="revenue"
        />
        <KpiCard
          label="Total expenses"
          value={formatCurrency(quarterly.totalExpenseCents, { compact: true })}
          hint="Client entertainment & travel"
          icon={DollarSign}
          tone="expense"
        />
        <KpiCard
          label="Net"
          value={`${netCents >= 0 ? "+" : ""}${formatCurrency(netCents, { compact: true })}`}
          hint="Revenue minus expenses"
          icon={Activity}
          tone="neutral"
        />
        <KpiCard
          label="Pipeline"
          value={formatCurrency(quarterly.pipelineRevenueCents, { compact: true })}
          hint="Open deals (all time)"
          icon={TrendingUp}
        />
        <KpiCard
          label="Clients"
          value={String(clients.length)}
          hint={`${Math.round(quarterly.totalMinutes / 60)}h invested`}
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs. expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueExpenseChart data={chartData} />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          <Link
            href="/reports"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View reports
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No activities yet"
            description="Log lunches, meetings, and outings to start tracking client ROI."
            actionLabel="Log activity"
            actionHref="/log"
            icon={Clock}
          />
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((item) => {
                  const client = clients.find((c) => c.id === item.client_id);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-900">
                        {item.title}
                      </TableCell>
                      <TableCell>{client?.name ?? "Unknown"}</TableCell>
                      <TableCell className="text-slate-500">
                        {new Date(item.occurred_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.activity_type}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  );
}
