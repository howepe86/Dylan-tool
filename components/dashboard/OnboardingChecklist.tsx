"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = [
  { id: "client", label: "Add your first client", href: "/clients/new" },
  { id: "log", label: "Log a client touchpoint", href: "/log" },
  { id: "expense", label: "Track an expense", href: "/expenses" },
  { id: "deal", label: "Add a deal to pipeline", href: "/deals" },
  { id: "report", label: "Review quarterly ROI", href: "/reports" },
] as const;

export function OnboardingChecklist({
  hasClients,
  hasActivities,
  hasExpenses,
  hasDeals,
}: {
  hasClients: boolean;
  hasActivities: boolean;
  hasExpenses: boolean;
  hasDeals: boolean;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem("cl-onboarding-dismissed") === "1");
  }, []);

  const completed = {
    client: hasClients,
    log: hasActivities,
    expense: hasExpenses,
    deal: hasDeals,
    report: hasActivities && hasExpenses,
  };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const allDone = doneCount === STEPS.length;

  if (dismissed || allDone) return null;

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Get started with ClientLedger</CardTitle>
        <span className="text-xs font-medium text-indigo-600">
          {doneCount}/{STEPS.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        {STEPS.map((step) => {
          const done = completed[step.id];
          return (
            <Link
              key={step.id}
              href={step.href}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/80"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
              )}
              <span className={done ? "text-slate-500 line-through" : "text-slate-900"}>
                {step.label}
              </span>
            </Link>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-slate-500"
          onClick={() => {
            localStorage.setItem("cl-onboarding-dismissed", "1");
            setDismissed(true);
          }}
        >
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
}
