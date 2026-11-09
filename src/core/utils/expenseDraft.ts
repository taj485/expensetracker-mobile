import type {
  AddExpenseCommand,
  Expense,
  ExpenseCategory,
  ExtractedExpense,
  UpdateExpenseCommand,
} from '@/core/models/expense.model';
import { todayLocalISODate } from '@/core/utils/dateUtils';
import { discountText, INVALID_DISCOUNT, itemDiscountError, parseDiscount } from '@/core/utils/discountUtils';

/**
 * An expense being entered or reviewed — the Add expense form, or a line item read off a
 * scanned receipt. Numbers are kept as the text the user typed so half-typed values like
 * "3." don't get mangled; they're parsed on save.
 */
export interface DraftExpense {
  key: number;
  description: string;
  merchant: string;
  category: ExpenseCategory;
  unitPrice: string;
  quantity: string;
  /** Discount on the whole line in £; empty means none. */
  discount: string;
  /** YYYY-MM-DD */
  date: string;
}

export type DraftErrors = Partial<Record<'description' | 'unitPrice' | 'quantity' | 'discount' | 'date', string>>;

let nextKey = 0;

/** Blank form, with the same defaults as the web Add expense form. */
export function emptyDraft(): DraftExpense {
  return {
    key: nextKey++,
    description: '',
    merchant: '',
    category: 'Food',
    unitPrice: '',
    quantity: '1',
    discount: '',
    date: todayLocalISODate(),
  };
}

/** A saved expense as an editable draft. The key is the expense id, so edits map back to it. */
export function fromExpense(expense: Expense): DraftExpense {
  return {
    key: expense.id,
    description: expense.description,
    merchant: expense.merchant ?? '',
    category: expense.category,
    unitPrice: expense.unitPrice.toFixed(2),
    quantity: String(expense.quantity),
    discount: discountText(expense.discount),
    date: expense.date.slice(0, 10),
  };
}

/** The API's update body for a draft of a saved expense. */
export function toUpdateCommand(draft: DraftExpense): UpdateExpenseCommand {
  const { unitPrice, quantity, category, description, merchant, discount } = toCommand(draft);
  return { unitPrice, quantity, category, description, merchant, discount };
}

export function toDraft(item: ExtractedExpense): DraftExpense {
  return {
    key: nextKey++,
    description: item.description,
    merchant: item.merchant ?? '',
    category: item.category,
    unitPrice: item.unitPrice.toFixed(2),
    quantity: String(item.quantity),
    discount: discountText(item.discount),
    date: item.date.slice(0, 10),
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDraft(draft: DraftExpense): DraftErrors {
  const errors: DraftErrors = {};
  const price = Number(draft.unitPrice);
  const quantity = Number(draft.quantity);

  if (!draft.description.trim()) errors.description = 'Description is required.';
  if (!(price > 0)) errors.unitPrice = 'Enter a price above £0.';
  if (!Number.isInteger(quantity) || quantity < 1) errors.quantity = 'Whole number, 1 or more.';
  const discount = parseDiscount(draft.discount);
  if (Number.isNaN(discount)) errors.discount = INVALID_DISCOUNT;
  else if (!errors.unitPrice && !errors.quantity) {
    const discountError = itemDiscountError({ unitPrice: price, quantity, discount });
    if (discountError) errors.discount = discountError;
  }
  if (!ISO_DATE.test(draft.date) || Number.isNaN(new Date(draft.date).getTime())) {
    errors.date = 'Use YYYY-MM-DD.';
  } else if (draft.date > todayLocalISODate()) {
    errors.date = "Date can't be in the future.";
  }
  return errors;
}

export function hasErrors(errors: DraftErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toCommand(draft: DraftExpense): AddExpenseCommand {
  return {
    // Filled in per space when the request is sent.
    expenseTableId: 0,
    unitPrice: Math.round(Number(draft.unitPrice) * 100) / 100,
    quantity: Number(draft.quantity),
    category: draft.category,
    description: draft.description.trim(),
    date: draft.date,
    merchant: draft.merchant.trim() || null,
    discount: parseDiscount(draft.discount) || 0,
  };
}

/** A draft's figures for the discount helpers; text that isn't a number counts as 0 so totals stay live. */
export function toLine(draft: DraftExpense) {
  return {
    unitPrice: Number(draft.unitPrice) || 0,
    quantity: Number(draft.quantity) || 0,
    discount: parseDiscount(draft.discount) || 0,
  };
}
