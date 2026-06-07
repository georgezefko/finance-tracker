// Centralised number/date formatting so money reads consistently everywhere.
// Currency + locale are configurable via env so this isn't hard-wired to one user.
const CURRENCY = process.env.REACT_APP_CURRENCY || 'DKK';
const LOCALE = process.env.REACT_APP_LOCALE || 'da-DK';

const safe = (value: number): number => (Number.isFinite(value) ? value : 0);

// e.g. 52340 -> "52.340 kr." (da-DK). No decimals — these are dashboard totals.
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(safe(value));

// Compact variant for chart axis ticks, e.g. 52340 -> "52K kr.".
export const formatCompactCurrency = (value: number): string =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safe(value));

export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${safe(value).toLocaleString(LOCALE, {
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
