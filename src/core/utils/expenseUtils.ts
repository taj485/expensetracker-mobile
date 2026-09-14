import type { Expense } from '@/core/models/expense.model';

// Ported from the web client (core/utils/expense.utils.ts).
/** Line total for an expense: unit price x quantity, rounded to whole pence. */
export function expenseTotal(expense: { unitPrice: number; quantity: number }): number {
  return Math.round(expense.unitPrice * expense.quantity * 100) / 100;
}

export function sumExpenses(expenses: Expense[]): number {
  return Math.round(expenses.reduce((sum, e) => sum + expenseTotal(e), 0) * 100) / 100;
}

/** One receipt card: a merchant header carrying the receipt total, over its line items. */
export interface ReceiptGroup {
  key: string;
  merchant: string | null;
  merchantWebsite: string | null;
  date: string;
  receiptId: number | null;
  total: number;
  expenses: Expense[];
}

const byDateDesc = (a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime();

/**
 * Groups expenses scanned from the same receipt into one card; manual expenses get a card
 * each. Newest first — same rules as the web expense list.
 */
export function groupByReceipt(expenses: Expense[]): ReceiptGroup[] {
  const buckets = new Map<string, Expense[]>();

  for (const expense of expenses) {
    const key = expense.receiptId != null ? `r${expense.receiptId}` : `e${expense.id}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(expense);
    else buckets.set(key, [expense]);
  }

  return Array.from(buckets.entries())
    .map(([key, group]) => {
      const items = [...group].sort(byDateDesc);
      const first = items[0];
      return {
        key,
        merchant: first.merchant,
        merchantWebsite: first.merchantWebsite,
        date: first.date,
        receiptId: first.receiptId,
        total: sumExpenses(items),
        expenses: items,
      };
    })
    .sort((a, b) => byDateDesc(a.expenses[0], b.expenses[0]));
}
