import { eachMonthOfInterval, format, getQuarter, parseISO } from "date-fns";

import { formatCurrency } from "@/lib/format/currency";
import type {
  ActivityType,
  ClientSummary,
  Deal,
  Expense,
  Interaction,
  PeriodReport,
} from "@/types/database";

export { formatCurrency as formatMoney };

function inPeriod(
  isoDate: string,
  year: number,
  quarter?: number
): boolean {
  const date = parseISO(isoDate);
  if (date.getFullYear() !== year) return false;
  if (quarter === undefined) return true;
  return getQuarter(date) === quarter;
}

export function buildPeriodReport({
  year,
  quarter,
  clients,
  interactions,
  expenses,
  deals,
  includeEmptyClients = false,
}: {
  year: number;
  quarter?: number;
  clients: { id: string; name: string; company: string | null }[];
  interactions: Interaction[];
  expenses: Expense[];
  deals: Deal[];
  includeEmptyClients?: boolean;
}): PeriodReport {
  const periodInteractions = interactions.filter((item) =>
    inPeriod(item.occurred_at, year, quarter)
  );
  const periodExpenses = expenses.filter((item) =>
    inPeriod(item.incurred_at, year, quarter)
  );
  const periodDeals = deals.filter((deal) => {
    if (deal.status !== "closed" || !deal.closed_at) return false;
    return inPeriod(deal.closed_at, year, quarter);
  });
  const pipelineDeals = deals.filter((deal) => deal.status === "pipeline");

  const totalMinutes = periodInteractions.reduce(
    (sum, item) => sum + item.duration_minutes,
    0
  );
  const totalExpenseCents = periodExpenses.reduce(
    (sum, item) => sum + item.amount_cents,
    0
  );
  const closedRevenueCents = periodDeals.reduce(
    (sum, item) => sum + item.amount_cents,
    0
  );
  const pipelineRevenueCents = pipelineDeals.reduce(
    (sum, item) => sum + item.amount_cents,
    0
  );

  const clientSummaries: ClientSummary[] = clients.map((client) => {
    const clientInteractions = periodInteractions.filter(
      (item) => item.client_id === client.id
    );
    const clientExpenses = periodExpenses.filter(
      (item) => item.client_id === client.id
    );
    const clientClosed = periodDeals.filter(
      (item) => item.client_id === client.id
    );
    const clientPipeline = pipelineDeals.filter(
      (item) => item.client_id === client.id
    );

    return {
      clientId: client.id,
      clientName: client.name,
      company: client.company,
      interactionCount: clientInteractions.length,
      totalMinutes: clientInteractions.reduce(
        (sum, item) => sum + item.duration_minutes,
        0
      ),
      totalExpenseCents: clientExpenses.reduce(
        (sum, item) => sum + item.amount_cents,
        0
      ),
      closedRevenueCents: clientClosed.reduce(
        (sum, item) => sum + item.amount_cents,
        0
      ),
      pipelineRevenueCents: clientPipeline.reduce(
        (sum, item) => sum + item.amount_cents,
        0
      ),
    };
  });

  const roiPercent =
    totalExpenseCents > 0
      ? Math.round(
          ((closedRevenueCents - totalExpenseCents) / totalExpenseCents) * 100
        )
      : null;

  const periodLabel =
    quarter !== undefined ? `Q${quarter} ${year}` : `${year}`;

  return {
    periodLabel,
    year,
    quarter,
    totalMinutes,
    totalExpenseCents,
    closedRevenueCents,
    pipelineRevenueCents,
    roiPercent,
    clientSummaries: includeEmptyClients
    ? clientSummaries
    : clientSummaries.filter(
        (item) =>
          item.interactionCount > 0 ||
          item.totalExpenseCents > 0 ||
          item.closedRevenueCents > 0 ||
          item.pipelineRevenueCents > 0
      ),
  };
}

export function buildMonthlyTrend({
  year,
  quarter,
  expenses,
  deals,
}: {
  year: number;
  quarter?: number;
  expenses: Expense[];
  deals: Deal[];
}) {
  const startMonth = quarter ? (quarter - 1) * 3 : 0;
  const endMonth = quarter ? startMonth + 2 : 11;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, endMonth + 1, 0);

  const months = eachMonthOfInterval({ start, end });

  return months.map((month) => {
    const label = format(month, "MMM");
    const monthExpenses = expenses.filter((item) => {
      const date = parseISO(item.incurred_at);
      return (
        date.getFullYear() === month.getFullYear() &&
        date.getMonth() === month.getMonth()
      );
    });
    const monthRevenue = deals.filter((deal) => {
      if (deal.status !== "closed" || !deal.closed_at) return false;
      const date = parseISO(deal.closed_at);
      return (
        date.getFullYear() === month.getFullYear() &&
        date.getMonth() === month.getMonth()
      );
    });

    return {
      label,
      revenue: monthRevenue.reduce((sum, d) => sum + d.amount_cents, 0),
      expenses: monthExpenses.reduce((sum, e) => sum + e.amount_cents, 0),
    };
  });
}

export const ACTIVITY_TYPES: { id: ActivityType; label: string }[] = [
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "golf", label: "Golf / outing" },
  { id: "meeting", label: "Meeting" },
  { id: "call", label: "Call" },
  { id: "email", label: "Email" },
  { id: "other", label: "Other" },
];

export const EXPENSE_CATEGORIES = [
  "entertainment",
  "meals",
  "travel",
  "gifts",
  "other",
] as const;
