"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { formatMoney } from "@/lib/reports";
import type { PeriodReport } from "@/types/database";

export function ReportsClient({
  yearlyReport,
  quarterlyReport,
  year,
  quarter,
}: {
  yearlyReport: PeriodReport;
  quarterlyReport: PeriodReport;
  year: number;
  quarter: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const report = searchParams.get("view") === "year" ? yearlyReport : quarterlyReport;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Compare client investment vs. revenue closed.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={year}
            onChange={(event) =>
              router.push(`/reports?year=${event.target.value}&quarter=${quarter}`)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={quarter}
            onChange={(event) =>
              router.push(`/reports?year=${year}&quarter=${event.target.value}`)
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4].map((q) => (
              <option key={q} value={q}>
                Q{q}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <ViewTab
          active={searchParams.get("view") !== "year"}
          label={`Q${quarter} ${year}`}
          onClick={() => router.push(`/reports?year=${year}&quarter=${quarter}`)}
        />
        <ViewTab
          active={searchParams.get("view") === "year"}
          label={`${year} full year`}
          onClick={() =>
            router.push(`/reports?year=${year}&quarter=${quarter}&view=year`)
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Time invested" value={`${Math.round(report.totalMinutes / 60)}h`} />
        <StatCard label="Expenses" value={formatMoney(report.totalExpenseCents)} />
        <StatCard label="Closed revenue" value={formatMoney(report.closedRevenueCents)} />
        <StatCard
          label="ROI"
          value={
            report.roiPercent === null ? "—" : `${report.roiPercent}%`
          }
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Activities</th>
              <th className="px-4 py-3 font-medium">Hours</th>
              <th className="px-4 py-3 font-medium">Expenses</th>
              <th className="px-4 py-3 font-medium">Closed</th>
            </tr>
          </thead>
          <tbody>
            {report.clientSummaries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No data for this period yet.
                </td>
              </tr>
            ) : (
              report.clientSummaries.map((row) => (
                <tr key={row.clientId} className="border-t border-zinc-800">
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${row.clientId}`}
                      className="font-medium text-white hover:text-sky-400"
                    >
                      {row.clientName}
                    </Link>
                    {row.company ? (
                      <p className="text-xs text-zinc-500">{row.company}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{row.interactionCount}</td>
                  <td className="px-4 py-3">
                    {(row.totalMinutes / 60).toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    {formatMoney(row.totalExpenseCents)}
                  </td>
                  <td className="px-4 py-3">
                    {formatMoney(row.closedRevenueCents)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ViewTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
