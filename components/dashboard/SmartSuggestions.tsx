"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ActivitySuggestion, ExpenseSuggestion } from "@/lib/categorize";

export function SmartSuggestions({
  activity,
  expense,
  durationMinutes,
  onApplyActivity,
  onApplyExpense,
  onApplyDuration,
}: {
  activity: ActivitySuggestion | null;
  expense: ExpenseSuggestion | null;
  durationMinutes?: number;
  onApplyActivity: (type: string) => void;
  onApplyExpense: (category: string) => void;
  onApplyDuration: (minutes: number) => void;
}) {
  if (!activity && !expense && !durationMinutes) return null;

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-900">
        <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden />
        Smart suggestions
      </div>
      <div className="flex flex-wrap gap-2">
        {activity && activity.confidence >= 40 ? (
          <SuggestionChip
            label={`${activity.activityType} (${activity.confidence}%)`}
            hint={activity.reason}
            onApply={() => onApplyActivity(activity.activityType)}
          />
        ) : null}
        {expense && expense.confidence >= 40 ? (
          <SuggestionChip
            label={`${expense.category} expense (${expense.confidence}%)`}
            hint={expense.reason}
            onApply={() => onApplyExpense(expense.category)}
          />
        ) : null}
        {durationMinutes ? (
          <SuggestionChip
            label={`${durationMinutes} min`}
            hint="Typical duration"
            onApply={() => onApplyDuration(durationMinutes)}
          />
        ) : null}
      </div>
    </div>
  );
}

function SuggestionChip({
  label,
  hint,
  onApply,
}: {
  label: string;
  hint: string;
  onApply: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-auto border-indigo-200 bg-white py-1.5 text-left text-xs hover:bg-indigo-50"
      onClick={onApply}
      title={hint}
    >
      {label}
    </Button>
  );
}
