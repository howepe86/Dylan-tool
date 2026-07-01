"use client";

import Link from "next/link";
import { Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function WeeklyGoal({ count, target = 5 }: { count: number; target?: number }) {
  const pct = Math.min(100, Math.round((count / target) * 100));
  const met = count >= target;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-indigo-600" aria-hidden />
          Weekly touchpoint goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-slate-900">{count}</p>
          <p className="text-sm text-slate-500">of {target} target</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              met ? "bg-emerald-500" : "bg-indigo-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {met ? (
            <span className="text-emerald-600">Goal met this week.</span>
          ) : (
            <>
              {target - count} more to hit your weekly target.{" "}
              <Link href="/log" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log now →
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
