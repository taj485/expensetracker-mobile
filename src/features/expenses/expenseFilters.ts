import type { ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES } from '@/core/utils/categoryUtils';

/**
 * Expenses filters live in the route's search params, like the web expense list's query params,
 * so other screens can link straight to a filtered view:
 *   ?spaceId=1&month=2026-09&category=Food,Health
 */
export interface ExpenseFilterParams {
  spaceId?: string;
  /** 'YYYY-MM' */
  month?: string;
  /** Comma-separated categories. */
  category?: string;
}

export interface ExpenseFilters {
  month: string | null;
  /** Empty means every category. */
  categories: ExpenseCategory[];
}

const MONTH_KEY = /^\d{4}-\d{2}$/;
const NO_FILTERS: ExpenseFilters = { month: null, categories: [] };

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
  return {
    month: params.month && MONTH_KEY.test(params.month) ? params.month : null,
    categories,
  };
}

/** Search params for a filtered Expenses view. Unset filters are removed from the URL. */
export function toExpenseFilterParams(spaceId: number, filters: ExpenseFilters): Record<keyof ExpenseFilterParams, string | undefined> {
  return {
    spaceId: String(spaceId),
    month: filters.month ?? undefined,
    category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
  };
}

/**
 * Removes the category if it's selected; otherwise adds it at the front, so the pill just tapped
 * leads the chip row.
 */
export function toggleCategory(categories: ExpenseCategory[], category: ExpenseCategory): ExpenseCategory[] {
  return categories.includes(category) ? categories.filter(c => c !== category) : [category, ...categories];
}
