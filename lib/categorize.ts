import type { ActivityType } from "@/types/database";

import { ACTIVITY_TYPES, EXPENSE_CATEGORIES } from "./reports";

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface ActivitySuggestion {
  activityType: ActivityType;
  confidence: number;
  reason: string;
}

export interface ExpenseSuggestion {
  category: ExpenseCategory;
  confidence: number;
  reason: string;
}

export interface DurationSuggestion {
  minutes: number;
  reason: string;
}

const ACTIVITY_RULES: { type: ActivityType; keywords: string[]; reason: string }[] = [
  { type: "lunch", keywords: ["lunch", "brunch", "café", "cafe", "coffee"], reason: "Meal keywords" },
  { type: "dinner", keywords: ["dinner", "steakhouse", "restaurant", "drinks", "happy hour"], reason: "Evening dining" },
  { type: "golf", keywords: ["golf", "outing", "green fee", "round of golf", "country club"], reason: "Outing keywords" },
  { type: "meeting", keywords: ["meeting", "demo", "workshop", "presentation", "site visit", "kickoff", "review"], reason: "In-person meeting" },
  { type: "call", keywords: ["call", "zoom", "teams", "phone", "video", "sync"], reason: "Remote conversation" },
  { type: "email", keywords: ["email", "follow-up email", "intro email", "sent email"], reason: "Async outreach" },
];

const EXPENSE_RULES: { category: ExpenseCategory; keywords: string[]; reason: string }[] = [
  { category: "meals", keywords: ["lunch", "dinner", "breakfast", "coffee", "restaurant", "meal"], reason: "Food & dining" },
  { category: "entertainment", keywords: ["golf", "tickets", "event", "game", "concert", "green fee"], reason: "Entertainment" },
  { category: "travel", keywords: ["flight", "hotel", "uber", "lyft", "parking", "mileage", "airfare"], reason: "Travel costs" },
  { category: "gifts", keywords: ["gift", "wine", "flowers", "holiday"], reason: "Client gifts" },
];

const DEFAULT_DURATIONS: Record<ActivityType, number> = {
  lunch: 90,
  dinner: 120,
  golf: 240,
  meeting: 60,
  call: 30,
  email: 15,
  other: 45,
};

function scoreKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    if (lower.includes(keyword)) score += keyword.includes(" ") ? 3 : 1;
  }
  return score;
}

export function suggestActivityType(title: string, notes = ""): ActivitySuggestion | null {
  const text = `${title} ${notes}`.trim();
  if (!text) return null;

  let best: ActivitySuggestion | null = null;
  for (const rule of ACTIVITY_RULES) {
    const score = scoreKeywords(text, rule.keywords);
    if (score === 0) continue;
    const confidence = Math.min(95, 45 + score * 15);
    if (!best || confidence > best.confidence) {
      best = { activityType: rule.type, confidence, reason: rule.reason };
    }
  }
  return best;
}

export function suggestExpenseCategory(title: string, notes = ""): ExpenseSuggestion | null {
  const text = `${title} ${notes}`.trim();
  if (!text) return null;

  let best: ExpenseSuggestion | null = null;
  for (const rule of EXPENSE_RULES) {
    const score = scoreKeywords(text, rule.keywords);
    if (score === 0) continue;
    const confidence = Math.min(90, 40 + score * 15);
    if (!best || confidence > best.confidence) {
      best = { category: rule.category, confidence, reason: rule.reason };
    }
  }
  return best;
}

export function suggestDuration(activityType: ActivityType): DurationSuggestion {
  return {
    minutes: DEFAULT_DURATIONS[activityType] ?? 60,
    reason: `Typical ${ACTIVITY_TYPES.find((t) => t.id === activityType)?.label ?? activityType} duration`,
  };
}

export function suggestExpenseAmount(text: string): number | null {
  const matches = text.match(/\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+\.\d{2})/g);
  if (!matches?.length) return null;

  const amounts = matches
    .map((m) => parseFloat(m.replace(/[$,\s]/g, "")))
    .filter((n) => n > 0 && n < 100_000);

  if (!amounts.length) return null;
  return Math.max(...amounts);
}
