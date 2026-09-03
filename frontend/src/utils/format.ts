// Centralised number/date formatting so money reads consistently everywhere.
// Amounts are stored and served in DKK; the display currency is a UI choice
// (see CurrencyContext), so conversion happens here at the render edge.
export const CURRENCIES = ['DKK', 'EUR', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

// ponytail: hardcoded rates, DKK per 1 unit. Edit when they drift; swap for an
// FX endpoint only if the numbers need to be right to the day.
const DKK_PER: Record<Currency, number> = { DKK: 1, EUR: 7.46, USD: 6.9 };
const LOCALES: Record<Currency, string> = { DKK: 'da-DK', EUR: 'de-DE', USD: 'en-US' };

export const toDkk = (value: number, from: Currency): number => value * DKK_PER[from];
export const fromDkk = (value: number, to: Currency): number => value / DKK_PER[to];

const safe = (value: number): number => (Number.isFinite(value) ? value : 0);

// e.g. 52340 -> "52.340 kr." (da-DK). No decimals — these are dashboard totals.
export const formatCurrency = (value: number, currency: Currency = 'DKK'): string =>
  new Intl.NumberFormat(LOCALES[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(safe(value));

// Compact variant for chart axis ticks, e.g. 52340 -> "52K kr.".
export const formatCompactCurrency = (value: number, currency: Currency = 'DKK'): string =>
  new Intl.NumberFormat(LOCALES[currency], {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safe(value));

// Percentages are currency-invariant — savings rate, allocation share, MoM/YTD %.
export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${safe(value).toLocaleString('da-DK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  })}%`;

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Accepts 'YYYY-MM' or 'YYYY-MM-DD' and returns a short month label e.g. 'Jan'.
// Falls back to the raw value if it can't be parsed.
export const formatMonthTick = (value: string): string => {
  if (!value) return '';
  const parts = String(value).split('-');
  if (parts.length >= 2) {
    const month = parseInt(parts[1], 10);
    if (month >= 1 && month <= 12) return MONTH_LABELS[month - 1];
  }
  return String(value);
};
