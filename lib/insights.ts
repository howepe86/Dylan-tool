import { differenceInDays, getQuarter, parseISO } from "date-fns";

import { buildPeriodReport } from "@/lib/reports";
import type {
  ActivityType,
  Client,
  ClientSummary,
  Deal,
  Expense,
  Interaction,
} from "@/types/database";

export type HealthTier = "excellent" | "good" | "fair" | "at-risk";

export interface ClientHealth {
  clientId: string;
  clientName: string;
  company: string | null;
  score: number;
  tier: HealthTier;
  roiPercent: number | null;
  daysSinceContact: number | null;
  interactionCount: number;
  closedRevenueCents: number;
  totalExpenseCents: number;
}

export interface StaleClient {
  clientId: string;
  clientName: string;
  company: string | null;
  daysSinceContact: number;
  lastActivityTitle: string | null;
}

export interface ActivityBreakdown {
  type: ActivityType;
  label: string;
  count: number;
  totalMinutes: number;
}

export interface PeriodDelta {
  revenueDelta: number | null;
  expenseDelta: number | null;
  roiDelta: number | null;
  minutesDelta: number | null;
}

function tierFromScore(score: number): HealthTier {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "at-risk";
}

export function computeClientHealth(
  summary: ClientSummary,
  lastInteraction: Interaction | undefined,
  staleDaysThreshold = 30
): ClientHealth {
  let score = 50;

  const roi =
    summary.totalExpenseCents > 0
      ? Math.round(
          ((summary.closedRevenueCents - summary.totalExpenseCents) /
            summary.totalExpenseCents) *
            100
        )
      : summary.closedRevenueCents > 0
        ? 100
        : null;

  if (roi !== null) {
    if (roi >= 200) score += 25;
    else if (roi >= 100) score += 20;
    else if (roi >= 50) score += 10;
    else if (roi >= 0) score += 5;
    else score -= 15;
  }

  if (summary.interactionCount >= 4) score += 15;
  else if (summary.interactionCount >= 2) score += 8;
  else if (summary.interactionCount === 0) score -= 20;

  if (summary.pipelineRevenueCents > 0) score += 10;

  const daysSinceContact = lastInteraction
    ? differenceInDays(new Date(), parseISO(lastInteraction.occurred_at))
    : null;

  if (daysSinceContact !== null) {
    if (daysSinceContact <= 7) score += 10;
    else if (daysSinceContact <= 14) score += 5;
    else if (daysSinceContact > staleDaysThreshold) score -= 20;
    else if (daysSinceContact > 21) score -= 10;
  } else {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    clientId: summary.clientId,
    clientName: summary.clientName,
    company: summary.company,
    score,
    tier: tierFromScore(score),
    roiPercent: roi,
    daysSinceContact,
    interactionCount: summary.interactionCount,
    closedRevenueCents: summary.closedRevenueCents,
    totalExpenseCents: summary.totalExpenseCents,
  };
}

export function buildClientHealthScores(
  clients: Client[],
  interactions: Interaction[],
  expenses: Expense[],
  deals: Deal[],
  year: number,
  quarter: number
): ClientHealth[] {
  const report = buildPeriodReport({
    year,
    quarter,
    clients,
    interactions,
    expenses,
    deals,
  });

  return report.clientSummaries
    .map((summary) => {
      const lastInteraction = interactions
        .filter((i) => i.client_id === summary.clientId)
        .sort(
          (a, b) =>
            parseISO(b.occurred_at).getTime() - parseISO(a.occurred_at).getTime()
        )[0];
      return computeClientHealth(summary, lastInteraction);
    })
    .sort((a, b) => b.score - a.score);
}

export function findStaleClients(
  clients: Client[],
  interactions: Interaction[],
  thresholdDays = 30
): StaleClient[] {
  const now = new Date();
  return clients
    .map((client) => {
      const clientInteractions = interactions
        .filter((i) => i.client_id === client.id)
        .sort(
          (a, b) =>
            parseISO(b.occurred_at).getTime() - parseISO(a.occurred_at).getTime()
        );
      const latest = clientInteractions[0];
      if (!latest) {
        return {
          clientId: client.id,
          clientName: client.name,
          company: client.company,
          daysSinceContact: 999,
          lastActivityTitle: null,
        };
      }
      const days = differenceInDays(now, parseISO(latest.occurred_at));
      if (days < thresholdDays) return null;
      return {
        clientId: client.id,
        clientName: client.name,
        company: client.company,
        daysSinceContact: days,
        lastActivityTitle: latest.title,
      };
    })
    .filter((item): item is StaleClient => item !== null)
    .sort((a, b) => b.daysSinceContact - a.daysSinceContact);
}

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
  golf: "Golf / outing",
  meeting: "Meeting",
  call: "Call",
  email: "Email",
  other: "Other",
};

export function buildActivityBreakdown(
  interactions: Interaction[],
  year: number,
  quarter?: number
): ActivityBreakdown[] {
  const filtered = interactions.filter((item) => {
    const date = parseISO(item.occurred_at);
    if (date.getFullYear() !== year) return false;
    if (quarter !== undefined && getQuarter(date) !== quarter) return false;
    return true;
  });

  const types: ActivityType[] = [
    "lunch",
    "dinner",
    "golf",
    "meeting",
    "call",
    "email",
    "other",
  ];

  return types
    .map((type) => {
      const items = filtered.filter((i) => i.activity_type === type);
      return {
        type,
        label: ACTIVITY_LABELS[type],
        count: items.length,
        totalMinutes: items.reduce((s, i) => s + i.duration_minutes, 0),
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function computePeriodDelta(
  current: {
    closedRevenueCents: number;
    totalExpenseCents: number;
    roiPercent: number | null;
    totalMinutes: number;
  },
  previous: {
    closedRevenueCents: number;
    totalExpenseCents: number;
    roiPercent: number | null;
    totalMinutes: number;
  }
): PeriodDelta {
  function pctDelta(curr: number, prev: number): number | null {
    if (prev === 0) return curr > 0 ? 100 : null;
    return Math.round(((curr - prev) / prev) * 100);
  }

  return {
    revenueDelta: pctDelta(current.closedRevenueCents, previous.closedRevenueCents),
    expenseDelta: pctDelta(current.totalExpenseCents, previous.totalExpenseCents),
    roiDelta:
      current.roiPercent !== null && previous.roiPercent !== null
        ? current.roiPercent - previous.roiPercent
        : null,
    minutesDelta: pctDelta(current.totalMinutes, previous.totalMinutes),
  };
}

export function groupInteractionsByDate(
  interactions: Interaction[]
): Record<string, Interaction[]> {
  return interactions.reduce<Record<string, Interaction[]>>((acc, item) => {
    const key = parseISO(item.occurred_at).toISOString().slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}
