import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth/session";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildPeriodReport } from "@/lib/reports";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const quarterParam = searchParams.get("quarter");
  const view = searchParams.get("view") ?? "quarter";
  const quarter =
    view === "year" ? undefined : Number(quarterParam ?? Math.ceil((new Date().getMonth() + 1) / 3));

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
  });

  const header = [
    "Client",
    "Company",
    "Activities",
    "Hours",
    "Expenses (USD)",
    "Closed Revenue (USD)",
    "Pipeline (USD)",
  ];

  const rows = report.clientSummaries.map((row) => [
    row.clientName,
    row.company ?? "",
    String(row.interactionCount),
    (row.totalMinutes / 60).toFixed(1),
    (row.totalExpenseCents / 100).toFixed(2),
    (row.closedRevenueCents / 100).toFixed(2),
    (row.pipelineRevenueCents / 100).toFixed(2),
  ]);

  const csv = [header, ...rows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const filename = `clientledger-${report.periodLabel.replace(/\s+/g, "-").toLowerCase()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
