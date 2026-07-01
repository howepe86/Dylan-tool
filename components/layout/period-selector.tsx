"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PeriodSelector({
  year,
  quarter,
  basePath = "/reports",
}: {
  year: number;
  quarter: number;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "quarter";

  function navigate(next: { year?: number; quarter?: number; view?: string }) {
    const y = next.year ?? year;
    const q = next.quarter ?? quarter;
    const v = next.view ?? view;
    const params = new URLSearchParams({ year: String(y), quarter: String(q) });
    if (v === "year") params.set("view", "year");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays className="h-4 w-4" aria-hidden />
        <span className="sr-only">Period</span>
      </div>
      <Select
        value={String(year)}
        onValueChange={(value) => navigate({ year: Number(value) })}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[2024, 2025, 2026, 2027].map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(quarter)}
        onValueChange={(value) => navigate({ quarter: Number(value), view: "quarter" })}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4].map((q) => (
            <SelectItem key={q} value={String(q)}>
              Q{q}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tabs
        value={view === "year" ? "year" : "quarter"}
        onValueChange={(value) => navigate({ view: value })}
      >
        <TabsList>
          <TabsTrigger value="quarter">Quarter</TabsTrigger>
          <TabsTrigger value="year">Full year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
