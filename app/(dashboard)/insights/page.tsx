import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, Trophy } from "lucide-react";

import { ActivityBreakdownChart } from "@/components/charts/activity-breakdown-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth/session";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { formatCurrency } from "@/lib/format/currency";
import {
  buildActivityBreakdown,
  buildClientHealthScores,
  buildDealStats,
  findStaleClients,
  type HealthTier,
} from "@/lib/insights";
import { cn } from "@/lib/utils";

const tierStyles: Record<HealthTier, string> = {
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-indigo-50 text-indigo-700 border-indigo-200",
  fair: "bg-amber-50 text-amber-700 border-amber-200",
  "at-risk": "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function InsightsPage() {
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

  const healthScores = buildClientHealthScores(
    clients,
    interactions,
    expenses,
    deals,
    year,
    quarter
  );
  const staleClients = findStaleClients(clients, interactions);
  const activityBreakdown = buildActivityBreakdown(interactions, year, quarter);
  const dealStats = buildDealStats(deals);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Insights"
        description={`Relationship intelligence for Q${quarter} ${year}`}
        actions={
          <Link
            href="/compare"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Compare clients
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Win rate"
          value={dealStats.winRate !== null ? `${dealStats.winRate}%` : "—"}
          hint={`${dealStats.closedCount} closed · ${dealStats.lostCount} lost`}
          icon={Briefcase}
          tone="revenue"
        />
        <KpiCard
          label="Pipeline value"
          value={formatCurrency(dealStats.pipelineValueCents, { compact: true })}
          hint={`${dealStats.pipelineCount} open deals`}
          icon={Briefcase}
        />
        <KpiCard
          label="Closed (all time)"
          value={formatCurrency(dealStats.closedValueCents, { compact: true })}
          hint={`${dealStats.closedCount} deals won`}
          icon={Trophy}
          tone="revenue"
        />
        <KpiCard
          label="At-risk clients"
          value={String(staleClients.length)}
          hint="No contact in 30+ days"
          icon={AlertTriangle}
          tone={staleClients.length > 0 ? "expense" : "neutral"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-indigo-600" aria-hidden />
              Client health leaderboard
            </CardTitle>
            <Link href="/compare" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Compare →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthScores.length === 0 ? (
              <p className="text-sm text-slate-500">No client data yet.</p>
            ) : (
              healthScores.slice(0, 8).map((client, i) => (
                <Link
                  key={client.clientId}
                  href={`/clients/${client.clientId}`}
                  className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{client.clientName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {client.interactionCount} touchpoints ·{" "}
                      {formatCurrency(client.closedRevenueCents, { compact: true })} closed
                    </p>
                  </div>
                  <Badge className={cn("shrink-0 border", tierStyles[client.tier])}>
                    {client.score}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
              Follow-up reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {staleClients.length === 0 ? (
              <p className="text-sm text-emerald-600">All clients contacted within 30 days.</p>
            ) : (
              staleClients.map((client) => (
                <Link
                  key={client.clientId}
                  href={`/clients/${client.clientId}`}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 p-3 transition-colors hover:border-amber-200"
                >
                  <div>
                    <p className="font-medium text-slate-900">{client.clientName}</p>
                    <p className="text-xs text-slate-500">
                      {client.daysSinceContact >= 999
                        ? "No activities logged"
                        : `${client.daysSinceContact} days since last contact`}
                      {client.lastActivityTitle ? ` · ${client.lastActivityTitle}` : ""}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600" aria-hidden />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity mix this quarter</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityBreakdownChart data={activityBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
