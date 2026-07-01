import { ClientCompareClient } from "@/components/dashboard/ClientCompare";
import { getAuthUser } from "@/lib/auth/session";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildPeriodReport } from "@/lib/reports";

export default async function ComparePage() {
  const user = await getAuthUser();
  if (!user) return null;

  const year = new Date().getFullYear();
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;

  const [clients, interactions, expenses, deals] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
    listExpenses(user.id),
    listDeals(user.id),
  ]);

  const report = buildPeriodReport({
    year,
    quarter,
    clients,
    interactions,
    expenses,
    deals,
    includeEmptyClients: true,
  });

  return (
    <ClientCompareClient
      summaries={report.clientSummaries}
      periodLabel={report.periodLabel}
    />
  );
}
