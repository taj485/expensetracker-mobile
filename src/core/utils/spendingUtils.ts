import type { Expense, ExpenseCategory } from '@/core/models/expense.model';

import { ALL_CATEGORIES } from './categoryUtils';
import {
  addDays,
  dayKeyOf,
  elapsedDaysInMonth,
  formatMonthShort,
  formatWeekdayShort,
  monthKeyOf,
  periodRange,
  previousMonthKey,
} from './dateUtils';
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

/** The windows the Home spending chart can show, each ending today like the Health app's W / M / 6M / Y. */
export type ChartPeriod = 'week' | 'month' | 'half-year' | 'year';

/** One bar of the spending chart: a day, a week or a month. */
export interface SpendBucket {
  /** First and last day ('YYYY-MM-DD', inclusive). */
  start: string;
  end: string;
  total: number;
  /** Axis label. Empty for buckets that aren't labelled; labelled ones also get a divider line. */
  label: string;
}

export interface PeriodSpending {
  buckets: SpendBucket[];
  /** First and last day of the whole period. */
  start: string;
  end: string;
  /** Mean bucket total: per day for week and month, per week for half-year, per month for year. */
  average: number;
}

const DAYS_IN_MONTH_PERIOD = 30;
const WEEKS_IN_HALF_YEAR = 26;
const MONTHS_IN_YEAR = 12;

/** Spend per day, week or month over a rolling period that ends today. */
export function spendingBuckets(expenses: Expense[], period: ChartPeriod, now = new Date()): PeriodSpending {
  const ranges = bucketRanges(period, now);

  const dayTotals = new Map<string, number>();
  for (const e of expenses) {
    const day = dayKeyOf(e.date);
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + expenseTotal(e));
  }

  const buckets = ranges.map(({ start, end, label }) => {
    let total = 0;
    for (const [day, amount] of dayTotals) if (day >= start && day <= end) total += amount;
    // Summing pence-rounded lines can still drift (0.1 + 0.2), so round each bar too.
    return { start, end, label, total: Math.round(total * 100) / 100 };
  });

  return {
    buckets,
    start: buckets[0].start,
    end: buckets[buckets.length - 1].end,
    average: buckets.reduce((sum, b) => sum + b.total, 0) / buckets.length,
  };
}

function bucketRanges(period: ChartPeriod, now: Date): Omit<SpendBucket, 'total'>[] {
  const today = periodRange('today', now).start;
  switch (period) {
    case 'week':
      return Array.from({ length: 7 }, (_, i) => {
        const day = addDays(today, i - 6);
        return { start: day, end: day, label: formatWeekdayShort(day) };
      });
    case 'month':
      return Array.from({ length: DAYS_IN_MONTH_PERIOD }, (_, i) => {
        const day = addDays(today, i - (DAYS_IN_MONTH_PERIOD - 1));
        // A date every 7 days, so 30 labels never crowd.
        return { start: day, end: day, label: i % 7 === 0 ? String(Number(day.slice(8))) : '' };
      });
    case 'half-year': {
      const thisMonday = periodRange('this-week', now).start;
      return Array.from({ length: WEEKS_IN_HALF_YEAR }, (_, i) => {
        const start = addDays(thisMonday, (i - (WEEKS_IN_HALF_YEAR - 1)) * 7);
        const end = addDays(start, 6);
        // Label the week that holds the 1st of a month with that month's name.
        const holdsFirst = start.slice(8) === '01' || end.slice(5, 7) !== start.slice(5, 7);
        return { start, end, label: holdsFirst ? formatMonthShort(end) : '' };
      });
    }
    case 'year': {
      const keys = [today.slice(0, 7)];
      while (keys.length < MONTHS_IN_YEAR) keys.unshift(previousMonthKey(keys[0]));
      return keys.map(key => {
        const start = `${key}-01`;
        // The day before the 1st of next month.
        const end = addDays(nextMonthStart(key), -1);
        return { start, end, label: formatMonthShort(start).charAt(0) };
      });
    }
  }
}

function nextMonthStart(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`;
}
