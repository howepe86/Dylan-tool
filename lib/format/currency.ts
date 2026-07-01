const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

export function formatCurrency(
  cents: number,
  options?: { currency?: string; locale?: string; compact?: boolean }
) {
  const currency = options?.currency ?? DEFAULT_CURRENCY;
  const locale = options?.locale ?? DEFAULT_LOCALE;
  const dollars = cents / 100;

  if (options?.compact) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dollars);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

export function formatCurrencyFromDollars(
  amount: number,
  options?: { currency?: string; locale?: string; compact?: boolean }
) {
  return formatCurrency(Math.round(amount * 100), options);
}
