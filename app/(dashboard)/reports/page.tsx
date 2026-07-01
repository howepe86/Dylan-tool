import { Suspense } from "react";

import { ReportsClient } from "@/components/dashboard/ReportsClient";
import { getAuthUser } from "@/lib/auth/session";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildPeriodReport } from "@/lib/reports";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; quarter?: string; view?: string }>;
}) {
  const params = await searchParams;
  const user = await getAuthUser();
  if (!user) return null;

  const year = Number(params.year ?? new Date().getFullYear());
  const quarter = Number(
    params.quarter ?? Math.floor(new Date().getMonth() / 3) + 1
  );

  const [clients, interactions, expenses, deals] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
    listExpenses(user.id),
    listDeals(user.id),
  ]);

  const yearlyReport = buildPeriodReport({
    year,
    clients,
    interactions,
    expenses,
    deals,
  });
  const quarterlyReport = buildPeriodReport({
    year,
    quarter,
    clients,
    interactions,
    expenses,
    deals,
  });

  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading reports…</p>}>
      <ReportsClient
        yearlyReport={yearlyReport}
        quarterlyReport={quarterlyReport}
        year={year}
        quarter={quarter}
      />
    </Suspense>
  );
}
