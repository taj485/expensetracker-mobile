import type { Expense, ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES } from '@/core/utils/categoryUtils';
import { currentMonthKey, DATE_PERIODS, type DatePeriod, WEEKDAYS, type Weekday } from '@/core/utils/dateUtils';

/**
 * Expenses filters live in the route's search params, like the web expense list's query params,
 * so other screens can link straight to a filtered view:
 *   ?spaceId=1&period=last-week&weekday=mon&category=Food,Health
 *   ?spaceId=1&month=2026-10,2026-09
 * With no period or month the screen opens on the current month.
 */
export interface ExpenseFilterParams {
  spaceId?: string;
  /** Comma-separated 'YYYY-MM' keys. */
  month?: string;
  /** 'this-week' | 'last-week' | 'today', or 'all' for every month. */
  period?: string;
  /** 'mon'…'sun': one day of the selected week. */
  weekday?: string;
  /** Comma-separated categories. */
  category?: string;
  /** Text matched against product names and shops. */
  q?: string;
}

export interface ExpenseFilters {
  /** Empty means every month. Newest first. */
  months: string[];
  /**
   * A rolling period, or null for month-based filtering (all months when `months` is empty).
   * Left out (as Home's links do) with no months, the screen opens on the current month.
   */
  period?: DatePeriod | null;
  /** One day of a week period; null or left out for the whole week. */
  weekday?: Weekday | null;
  /** Empty means every category. */
  categories: ExpenseCategory[];
  /** Product or shop search, as typed. Empty matches everything. */
  search?: string;
}

const MONTH_KEY = /^\d{4}-\d{2}$/;

/**
 * Filters to apply for the selected space. Filters set for a different space are ignored, so
 * switching space in the sidebar shows that space unfiltered. Unknown categories are dropped.
 */
export function parseExpenseFilters(params: ExpenseFilterParams, selectedSpaceId: number | undefined): ExpenseFilters {
  // A function rather than a constant: the current month moves on while the app stays open.
  if (params.spaceId == null || Number(params.spaceId) !== selectedSpaceId) {
    return { months: [currentMonthKey()], period: null, categories: [] };
  }

  const requested = (params.category ?? '').split(',').map(c => c.trim());
  // Keep the URL's order (most recently selected first) — the chip row shows them in that order.
  const categories = requested.filter(
    (c, index): c is ExpenseCategory => ALL_CATEGORIES.includes(c as ExpenseCategory) && requested.indexOf(c) === index,
  );
  const requestedMonths = newestFirst((params.month ?? '').split(',').map(m => m.trim()).filter(m => MONTH_KEY.test(m)));
  const hasPeriod = params.period === 'all' || DATE_PERIODS.includes(params.period as DatePeriod);
  // With neither a month nor a period, the screen opens on the current month.
  const months = requestedMonths.length > 0 || hasPeriod ? requestedMonths : [currentMonthKey()];
  return {
    months,
    period: parsePeriod(params.period, months),
    weekday: WEEKDAYS.includes(params.weekday as Weekday) ? (params.weekday as Weekday) : null,
    search: params.q ?? '',
    categories,
  };
}

/** Search params for a filtered Expenses view. Unset filters are removed from the URL. */
export function toExpenseFilterParams(spaceId: number, filters: ExpenseFilters): Record<keyof ExpenseFilterParams, string | undefined> {
  return {
    spaceId: String(spaceId),
    month: filters.months.length > 0 ? filters.months.join(',') : undefined,
    // Months replace any period; null is stored as 'all' so it doesn't fall back to the current month.
    period: filters.months.length > 0 || filters.period === undefined ? undefined : (filters.period ?? 'all'),
    weekday: filters.weekday ?? undefined,
    category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
    q: filters.search?.trim() ? filters.search : undefined,
  };
}

/** A month in the URL (or the default current month) wins over a period. */
function parsePeriod(value: string | undefined, months: string[]): DatePeriod | null {
  if (months.length > 0) return null;
  return DATE_PERIODS.includes(value as DatePeriod) ? (value as DatePeriod) : null;
}

/** Adds or removes a month, keeping the list newest first. */
export function toggleMonth(months: string[], month: string): string[] {
  return months.includes(month) ? months.filter(m => m !== month) : newestFirst([...months, month]);
}

/** De-duplicated, newest first. 'YYYY-MM' keys sort correctly as strings. */
function newestFirst(months: string[]): string[] {
  return [...new Set(months)].sort().reverse();
}

/**
 * Removes the category if it's selected; otherwise adds it at the front, so the pill just tapped
 * leads the chip row.
 */
export function toggleCategory(categories: ExpenseCategory[], category: ExpenseCategory): ExpenseCategory[] {
  return categories.includes(category) ? categories.filter(c => c !== category) : [category, ...categories];
}

/** Case-insensitive match on the product name or the shop. A blank query matches everything. */
export function matchesSearch(expense: Pick<Expense, 'description' | 'merchant'>, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return expense.description.toLowerCase().includes(needle) || (expense.merchant ?? '').toLowerCase().includes(needle);
}
