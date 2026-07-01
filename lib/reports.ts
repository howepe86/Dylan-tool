import type {
  ActivityType,
  ClientSummary,
  Deal,
  Expense,
  Interaction,
  PeriodReport,
} from "@/types/database";

function getQuarter(date: Date) {
  return Math.floor(date.getMonth() / 3) + 1;
}

function inPeriod(
  isoDate: string,
  year: number,
  quarter?: number
): boolean {
  const date = new Date(isoDate);
  if (date.getFullYear() !== year) return false;
  if (quarter === undefined) return true;
  return getQuarter(date) === quarter;
}

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export { formatMoney };

export function buildPeriodReport({
  year,
  quarter,
  clients,
  interactions,
  expenses,
  deals,
}: {
  year: number;
  quarter?: number;
  clients: { id: string; name: string; company: string | null }[];
  interactions: Interaction[];
  expenses: Expense[];
  deals: Deal[];
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
    clientSummaries: clientSummaries.filter(
      (item) =>
        item.interactionCount > 0 ||
        item.totalExpenseCents > 0 ||
        item.closedRevenueCents > 0
    ),
  };
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
