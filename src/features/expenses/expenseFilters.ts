import type { ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES } from '@/core/utils/categoryUtils';

/**
 * Expenses filters live in the route's search params, like the web expense list's query params,
 * so other screens can link straight to a filtered view:
 *   ?spaceId=1&month=2026-10,2026-09&category=Food,Health
 */
export interface ExpenseFilterParams {
  spaceId?: string;
  /** Comma-separated 'YYYY-MM' keys. */
  month?: string;
  /** 'today' shows only expenses dated today. */
  day?: string;
  /** Comma-separated categories. */
  category?: string;
}

export interface ExpenseFilters {
  /** Empty means every month. Newest first. */
  months: string[];
  /** Only today's expenses. Optional so Home's links can leave it out. */
  today?: boolean;
  /** Empty means every category. */
  categories: ExpenseCategory[];
}

const MONTH_KEY = /^\d{4}-\d{2}$/;
const NO_FILTERS: ExpenseFilters = { months: [], categories: [] };

/**
 * Filters to apply for the selected space. Filters set for a different space are ignored, so
 * switching space in the sidebar shows that space unfiltered. Unknown categories are dropped.
 */
export function parseExpenseFilters(params: ExpenseFilterParams, selectedSpaceId: number | undefined): ExpenseFilters {
  if (params.spaceId == null || Number(params.spaceId) !== selectedSpaceId) return NO_FILTERS;

  const requested = (params.category ?? '').split(',').map(c => c.trim());
  // Keep the URL's order (most recently selected first) — the chip row shows them in that order.
  const categories = requested.filter(
    (c, index): c is ExpenseCategory => ALL_CATEGORIES.includes(c as ExpenseCategory) && requested.indexOf(c) === index,
  );
  const months = newestFirst((params.month ?? '').split(',').map(m => m.trim()).filter(m => MONTH_KEY.test(m)));
  return {
    months,
    // A day sits inside one month, so a month in the URL wins over a stale ?day.
    today: params.day === 'today' && months.length === 0,
    categories,
  };
}

/** Search params for a filtered Expenses view. Unset filters are removed from the URL. */
export function toExpenseFilterParams(spaceId: number, filters: ExpenseFilters): Record<keyof ExpenseFilterParams, string | undefined> {
  return {
    spaceId: String(spaceId),
    month: filters.months.length > 0 ? filters.months.join(',') : undefined,
    day: filters.today ? 'today' : undefined,
    category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
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
