import type { Expense, ExpenseCategory } from '@/core/models/expense.model';

import { ALL_CATEGORIES } from './categoryUtils';
import { dayKeyOf, elapsedDaysInMonth, monthKeyOf, previousMonthKey, todayLocalISODate } from './dateUtils';
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

/** One day's spend in a month, for the daily bar chart. */
export interface DailySpend {
  /** 'YYYY-MM-DD' */
  date: string;
  /** Day of the month, 1-31. */
  day: number;
  total: number;
  /** Still to come, so it is left empty rather than shown as £0. */
  isFuture: boolean;
}

/** Spend per day for every day of a 'YYYY-MM' month, in order. Ported from the web client. */
export function dailyTotals(expenses: Expense[], monthKey: string, today = todayLocalISODate()): DailySpend[] {
  const totals = new Map<string, number>();
  for (const e of expenses) {
    const day = dayKeyOf(e.date);
    if (day.startsWith(monthKey)) totals.set(day, (totals.get(day) ?? 0) + expenseTotal(e));
  }

  const [year, month] = monthKey.split('-').map(Number);
  // Day 0 of the next month is the last day of this one.
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = `${monthKey}-${String(i + 1).padStart(2, '0')}`;
    // Summing pence-rounded lines can still drift (0.1 + 0.2), so round the day too.
    const total = Math.round((totals.get(date) ?? 0) * 100) / 100;
    return { date, day: i + 1, total, isFuture: date > today };
  });
}
