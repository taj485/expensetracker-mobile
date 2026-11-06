import type { Expense, ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES } from '@/core/utils/categoryUtils';

/**
 * Expenses filters live in the route's search params, like the web expense list's query params,
 * so other screens can link straight to a filtered view:
 *   ?spaceId=1&category=Food,Health
 *   ?spaceId=1&month=2026-10,2026-09
 * With no month the screen opens on All months. Older links may still carry `period` or
 * `weekday`; those filters no longer exist, so the params are ignored.
 */
export interface ExpenseFilterParams {
  spaceId?: string;
  /** Comma-separated 'YYYY-MM' keys. */
  month?: string;
  /** Comma-separated categories. */
  category?: string;
  /** Text matched against product names and shops. */
  q?: string;
}

export interface ExpenseFilters {
  /** Empty means every month (the default). Newest first. */
  months: string[];
  /** Empty means every category. */
  categories: ExpenseCategory[];
  /** Product or shop search, as typed. Empty matches everything. */
  search?: string;
}

const MONTH_KEY = /^\d{4}-\d{2}$/;

/**
 * Filters to apply for the selected space. Filters set for a different space are ignored, so
 * switching space in the sidebar shows that space unfiltered, on All months. Unknown categories
 * are dropped.
 */
export function parseExpenseFilters(params: ExpenseFilterParams, selectedSpaceId: number | undefined): ExpenseFilters {
  if (params.spaceId == null || Number(params.spaceId) !== selectedSpaceId) {
    return { months: [], categories: [] };
  }

  const requested = (params.category ?? '').split(',').map(c => c.trim());
  // Keep the URL's order (most recently selected first) — the chip row shows them in that order.
  const categories = requested.filter(
    (c, index): c is ExpenseCategory => ALL_CATEGORIES.includes(c as ExpenseCategory) && requested.indexOf(c) === index,
  );
  return {
    // No month means All months.
    months: newestFirst((params.month ?? '').split(',').map(m => m.trim()).filter(m => MONTH_KEY.test(m))),
    search: params.q ?? '',
    categories,
  };
}

/** Search params for a filtered Expenses view. Unset filters are removed from the URL. */
export function toExpenseFilterParams(spaceId: number, filters: ExpenseFilters): Record<keyof ExpenseFilterParams, string | undefined> {
  return {
    spaceId: String(spaceId),
    month: filters.months.length > 0 ? filters.months.join(',') : undefined,
    category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
    q: filters.search?.trim() ? filters.search : undefined,
  };
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
