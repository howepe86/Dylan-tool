"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Download, Minus, Printer } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { PeriodSelector } from "@/components/layout/period-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format/currency";
import { computeEnhancedRoi } from "@/lib/roi";
import type { ClientSummary, PeriodReport } from "@/types/database";

const columnHelper = createColumnHelper<ClientSummary>();

const columns = [
  columnHelper.accessor("clientName", {
    header: "Client",
    cell: ({ row }) => (
      <div>
        <Link
          href={`/clients/${row.original.clientId}`}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {row.original.clientName}
        </Link>
        {row.original.company ? (
          <p className="text-xs text-slate-500">{row.original.company}</p>
        ) : null}
      </div>
    ),
  }),
  columnHelper.accessor("interactionCount", {
    header: () => <span className="block text-right">Activities</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("totalMinutes", {
    header: () => <span className="block text-right">Hours</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {(getValue() / 60).toFixed(1)}
      </span>
    ),
  }),
  columnHelper.accessor("totalExpenseCents", {
    header: () => <span className="block text-right">Expenses</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums text-rose-600">
        −{formatCurrency(getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("closedRevenueCents", {
    header: () => <span className="block text-right">Closed revenue</span>,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums text-emerald-600">
        +{formatCurrency(getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: "roi",
    header: () => <span className="block text-right">ROI</span>,
    cell: ({ row }) => {
      const exp = row.original.totalExpenseCents;
      const rev = row.original.closedRevenueCents;
      if (exp === 0) return <span className="block text-right text-slate-400">—</span>;
      const roi = Math.round(((rev - exp) / exp) * 100);
      return (
        <span
          className={`block text-right font-medium tabular-nums ${
            roi >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {roi >= 0 ? "+" : ""}
          {roi}%
        </span>
      );
    },
  }),
];

function ReportsTable({ rows }: { rows: ClientSummary[] }) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (rows.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-slate-500">
        No client data for this period.{" "}
        <Link href="/log" className="font-medium text-indigo-600">
          Log an activity
        </Link>
        .
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ReportsContent({
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
  const searchParams = useSearchParams();
  const report =
    searchParams.get("view") === "year" ? yearlyReport : quarterlyReport;

  const netCents = report.closedRevenueCents - report.totalExpenseCents;
  const enhanced = computeEnhancedRoi(report);

  return (
    <div className="space-y-8" id="report-print-area">
      <PageHeader
        title="Reports"
        description="Compare client investment vs. revenue closed."
        actions={
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <PeriodSelector year={year} quarter={quarter} />
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/api/reports/export?year=${year}&quarter=${quarter}&view=${searchParams.get("view") ?? "quarter"}`}
              >
                <Download className="mr-2 h-4 w-4" aria-hidden />
                Export CSV
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" aria-hidden />
              Print
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Time invested"
          value={`${Math.round(report.totalMinutes / 60)}h`}
        />
        <KpiCard
          label="Expenses"
          value={formatCurrency(report.totalExpenseCents, { compact: true })}
          tone="expense"
        />
        <KpiCard
          label="Closed revenue"
          value={formatCurrency(report.closedRevenueCents, { compact: true })}
          tone="revenue"
        />
        <KpiCard
          label="Pipeline"
          value={formatCurrency(report.pipelineRevenueCents, { compact: true })}
          hint="Open deals (all time)"
        />
        <KpiCard
          label="Net / ROI"
          value={
            report.roiPercent === null
              ? formatCurrency(netCents, { compact: true })
              : `${netCents >= 0 ? "+" : ""}${formatCurrency(netCents, { compact: true })} · ${report.roiPercent}%`
          }
          hint={
            report.roiPercent === null ? "No expenses to compute ROI" : "Expense-based ROI"
          }
        />
      </div>

      <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white">
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Time cost (est.)
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(enhanced.timeCostCents, { compact: true })}
            </p>
            <p className="text-xs text-slate-500">At $150/hr billable rate</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total investment
            </p>
            <p className="mt-1 text-xl font-bold text-rose-600">
              {formatCurrency(enhanced.totalInvestmentCents, { compact: true })}
            </p>
            <p className="text-xs text-slate-500">Expenses + time</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Adjusted ROI
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {enhanced.roiPercent !== null ? `${enhanced.roiPercent}%` : "—"}
            </p>
            <p className="text-xs text-slate-500">Includes your time investment</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Per-client breakdown
          </h2>
          <p className="text-sm text-slate-500">
            {report.periodLabel} ·{" "}
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              revenue
            </span>
            {" · "}
            <span className="inline-flex items-center gap-1 text-rose-600">
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
              expenses
            </span>
            {" · "}
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Minus className="h-3.5 w-3.5" aria-hidden />
              net
            </span>
          </p>
        </div>
        <ReportsTable rows={report.clientSummaries} />
      </Card>
    </div>
  );
}

export function ReportsClient(props: {
  yearlyReport: PeriodReport;
  quarterlyReport: PeriodReport;
  year: number;
  quarter: number;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading reports…</p>}>
      <ReportsContent {...props} />
    </Suspense>
  );
}
