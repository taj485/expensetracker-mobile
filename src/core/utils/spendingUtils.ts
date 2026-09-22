import type { Expense, ExpenseCategory } from '@/core/models/expense.model';

import { ALL_CATEGORIES } from './categoryUtils';
import { elapsedDaysInMonth, monthKeyOf, previousMonthKey } from './dateUtils';
import { expenseTotal, sumExpenses } from './expenseUtils';

export interface MonthSummary {
  total: number;
  transactions: number;
  /** Category with the highest spend, or null for an empty month. */
  topCategory: ExpenseCategory | null;
  dailyAverage: number;
  /** Percentage change vs the previous month; null when last month had no spend. */
  changeVsPreviousMonth: number | null;
}

export interface CategorySpend {
  category: ExpenseCategory;
  total: number;
  count: number;
  /** Share of the largest category (0–1) — drives the progress bar width. */
  shareOfLargest: number;
}

export function expensesInMonth(expenses: Expense[], monthKey: string): Expense[] {
  return expenses.filter(e => monthKeyOf(e.date) === monthKey);
}

export function categoryBreakdown(expenses: Expense[]): CategorySpend[] {
  const rows = ALL_CATEGORIES.map(category => {
    const inCategory = expenses.filter(e => e.category === category);
    return { category, total: sumExpenses(inCategory), count: inCategory.length };
  })
    .filter(row => row.count > 0)
    .sort((a, b) => b.total - a.total);

  const largest = rows[0]?.total ?? 0;
  return rows.map(row => ({ ...row, shareOfLargest: largest > 0 ? row.total / largest : 0 }));
}

export function summariseMonth(expenses: Expense[], monthKey: string): MonthSummary {
  const thisMonth = expensesInMonth(expenses, monthKey);
  const total = thisMonth.reduce((sum, e) => sum + expenseTotal(e), 0);
  const lastMonthTotal = sumExpenses(expensesInMonth(expenses, previousMonthKey(monthKey)));

  return {
    total,
    transactions: thisMonth.length,
    topCategory: categoryBreakdown(thisMonth)[0]?.category ?? null,
    dailyAverage: total / elapsedDaysInMonth(monthKey),
    changeVsPreviousMonth: lastMonthTotal > 0 ? ((total - lastMonthTotal) / lastMonthTotal) * 100 : null,
  };
}
