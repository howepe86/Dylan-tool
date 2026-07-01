import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  Lightbulb,
  TrendingUp,
  Users,
} from "lucide-react";

import { RevenueExpenseChart } from "@/components/charts/revenue-expense-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
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
import { computePeriodDelta, findStaleClients } from "@/lib/insights";
import { buildMonthlyTrend, buildPeriodReport } from "@/lib/reports";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const year = new Date().getFullYear();
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;
  const prevQuarter = quarter === 1 ? 4 : quarter - 1;
  const prevYear = quarter === 1 ? year - 1 : year;

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

  const previousQuarter = buildPeriodReport({
    year: prevYear,
    quarter: prevQuarter,
    clients,
    interactions,
    expenses,
    deals,
  });

  const deltas = computePeriodDelta(quarterly, previousQuarter);
  const staleClients = findStaleClients(clients, interactions).slice(0, 3);

  const chartData = buildMonthlyTrend({ year, quarter, expenses, deals });
  const netCents = quarterly.closedRevenueCents - quarterly.totalExpenseCents;
  const recent = interactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Financial overview for ${quarterly.periodLabel}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/insights">
                <Lightbulb className="mr-2 h-4 w-4" aria-hidden />
                Insights
              </Link>
            </Button>
            <Button asChild>
              <Link href="/log">Log activity</Link>
            </Button>
          </div>
        }
      />

      <OnboardingChecklist
        hasClients={clients.length > 0}
        hasActivities={interactions.length > 0}
        hasExpenses={expenses.length > 0}
        hasDeals={deals.length > 0}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total revenue"
          value={formatCurrency(quarterly.closedRevenueCents, { compact: true })}
          hint="Closed deals this quarter"
          icon={TrendingUp}
          tone="revenue"
          delta={deltas.revenueDelta}
          deltaLabel="vs last Q"
        />
        <KpiCard
          label="Total expenses"
          value={formatCurrency(quarterly.totalExpenseCents, { compact: true })}
          hint="Client entertainment & travel"
          icon={DollarSign}
          tone="expense"
          delta={deltas.expenseDelta}
          deltaLabel="vs last Q"
          invertDelta
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
          delta={deltas.minutesDelta}
          deltaLabel="time vs last Q"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue vs. expenses</CardTitle>
            <p className="text-sm text-slate-500">
              {formatCurrency(quarterly.closedRevenueCents, { compact: true })} closed ·{" "}
              {formatCurrency(quarterly.totalExpenseCents, { compact: true })} spent ·{" "}
              {quarterly.periodLabel}
            </p>
          </CardHeader>
          <CardContent className="pb-4">
            <RevenueExpenseChart data={chartData} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {staleClients.length > 0 ? (
            <Card className="border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
                  Needs follow-up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {staleClients.map((client) => (
                  <Link
                    key={client.clientId}
                    href={`/clients/${client.clientId}`}
                    className="block rounded-lg bg-amber-50/50 px-3 py-2 text-sm transition-colors hover:bg-amber-50"
                  >
                    <p className="font-medium text-slate-900">{client.clientName}</p>
                    <p className="text-xs text-slate-500">
                      {client.daysSinceContact >= 999
                        ? "No contact logged"
                        : `${client.daysSinceContact}d since last touch`}
                    </p>
                  </Link>
                ))}
                <Link
                  href="/insights"
                  className="block pt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all reminders →
                </Link>
              </CardContent>
            </Card>
          ) : null}
          <RecentExpenses expenses={expenses} clients={clients} />
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          <Link
            href="/activities"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Full timeline
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
                    <TableRow key={item.id} className="transition-colors hover:bg-slate-50/80">
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
