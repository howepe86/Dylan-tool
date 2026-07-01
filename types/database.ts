export type ActivityType =
  | "lunch"
  | "dinner"
  | "golf"
  | "meeting"
  | "call"
  | "email"
  | "other";

export type InputSource = "manual" | "calendar" | "voice";

export type DealStatus = "pipeline" | "closed" | "lost";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  notes: string | null;
  activity_type: ActivityType;
  occurred_at: string;
  duration_minutes: number;
  input_source: InputSource;
  calendar_event_id: string | null;
  voice_memo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  client_id: string;
  interaction_id: string | null;
  amount_cents: number;
  currency: string;
  category: string;
  description: string | null;
  incurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  amount_cents: number;
  currency: string;
  status: DealStatus;
  closed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientSummary {
  clientId: string;
  clientName: string;
  company: string | null;
  interactionCount: number;
  totalMinutes: number;
  totalExpenseCents: number;
  closedRevenueCents: number;
  pipelineRevenueCents: number;
}

export interface PeriodReport {
  periodLabel: string;
  year: number;
  quarter?: number;
  totalMinutes: number;
  totalExpenseCents: number;
  closedRevenueCents: number;
  pipelineRevenueCents: number;
  roiPercent: number | null;
  clientSummaries: ClientSummary[];
}
