import type { ExpenseCategory } from '@/core/models/expense.model';

// Ported from the web client (core/utils/category.utils.ts). Colours live in the theme
// (colors.category) so they switch with dark mode.

export const ALL_CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health'];

const CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transport: '🚌',
  Utilities: '⚡',
  Entertainment: '🎬',
  Health: '💊',
};

export function categoryEmoji(category: ExpenseCategory): string {
  return CATEGORY_EMOJI[category];
}
