import type { PeriodReport } from "@/types/database";

/** Default billable rate used for time-adjusted ROI ($/hr). */
export const DEFAULT_HOURLY_RATE_CENTS = 15_000;

export interface EnhancedRoi {
  timeCostCents: number;
  totalInvestmentCents: number;
  netCents: number;
  roiPercent: number | null;
  expenseOnlyRoiPercent: number | null;
}

export function computeEnhancedRoi(
  report: Pick<
    PeriodReport,
    "totalMinutes" | "totalExpenseCents" | "closedRevenueCents" | "roiPercent"
  >,
  hourlyRateCents = DEFAULT_HOURLY_RATE_CENTS
): EnhancedRoi {
  const timeCostCents = Math.round((report.totalMinutes / 60) * hourlyRateCents);
  const totalInvestmentCents = report.totalExpenseCents + timeCostCents;
  const netCents = report.closedRevenueCents - totalInvestmentCents;

  const roiPercent =
    totalInvestmentCents > 0
      ? Math.round((netCents / totalInvestmentCents) * 100)
      : report.closedRevenueCents > 0
        ? 100
        : null;

  return {
    timeCostCents,
    totalInvestmentCents,
    netCents,
    roiPercent,
    expenseOnlyRoiPercent: report.roiPercent,
  };
}
