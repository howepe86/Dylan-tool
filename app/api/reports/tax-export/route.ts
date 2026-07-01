import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth/session";
import { listExpenses } from "@/lib/db/clients";
import { buildExpenseCategoryBreakdown } from "@/lib/insights";

/** Tax-deductible business expense categories for client entertainment tracking. */
const DEDUCTIBLE_CATEGORIES = new Set([
  "meals",
  "entertainment",
  "travel",
  "gifts",
]);

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const quarter = Number(
    searchParams.get("quarter") ?? Math.ceil((new Date().getMonth() + 1) / 3)
  );

  const expenses = await listExpenses(user.id);
  const breakdown = buildExpenseCategoryBreakdown(expenses, year, quarter);

  const header = ["Category", "Amount (USD)", "Tax deductible"];
  const rows = breakdown.map((row) => [
    row.category,
    (row.amountCents / 100).toFixed(2),
    DEDUCTIBLE_CATEGORIES.has(row.category) ? "Yes" : "Review",
  ]);

  const totalDeductible = breakdown
    .filter((r) => DEDUCTIBLE_CATEGORIES.has(r.category))
    .reduce((s, r) => s + r.amountCents, 0);

  rows.push(["", "", ""]);
  rows.push(["Total deductible", (totalDeductible / 100).toFixed(2), ""]);

  const csv = [header, ...rows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientledger-tax-q${quarter}-${year}.csv"`,
    },
  });
}
