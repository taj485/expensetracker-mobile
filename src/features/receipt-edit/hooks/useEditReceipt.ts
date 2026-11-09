import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useApiClient } from '@/core/api/useApiClient';
import type { Expense } from '@/core/models/expense.model';
import { queryKeys } from '@/core/queries/queryKeys';
import { deleteExpense, updateExpense, updateReceiptDiscount } from '@/core/services/expenseService';
import { discountText, parseDiscount, receiptDiscountTextError } from '@/core/utils/discountUtils';
import {
  type DraftErrors,
  type DraftExpense,
  fromExpense,
  hasErrors,
  toLine,
  toUpdateCommand,
  validateDraft,
} from '@/core/utils/expenseDraft';

/**
 * Edits every line of a saved receipt at once. The merchant is one field for the whole receipt;
 * the date is read-only because the API doesn't update it. Saving sends a PUT for each changed
 * line and a DELETE for each removed one, then, for a scanned receipt whose discount changed, the
 * receipt-discount PUT, so the server checks it against the final lines.
 */
export function useEditReceipt(spaceId: number, originals: Expense[]) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [merchant, setMerchant] = useState(() => originals[0]?.merchant ?? '');
  const [drafts, setDrafts] = useState<DraftExpense[]>(() => originals.map(fromExpense));
  const [errors, setErrors] = useState<Record<number, DraftErrors>>({});
  // Only scanned receipts have a receipt discount; manual expenses have no receipt id.
  const receiptId = originals[0]?.receiptId ?? null;
  const savedReceiptDiscount = originals[0]?.receiptDiscount ?? 0;
  const [receiptDiscount, setReceiptDiscountText] = useState(() => discountText(savedReceiptDiscount));
  const [receiptDiscountError, setReceiptDiscountError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(key: number, patch: Partial<DraftExpense>) {
    setDrafts(current => current.map(d => (d.key === key ? { ...d, ...patch } : d)));
    setErrors(current => {
      if (!current[key]) return current;
      const next = { ...current, [key]: { ...current[key] } };
      for (const field of Object.keys(patch)) delete next[key][field as keyof DraftErrors];
      if (!hasErrors(next[key])) delete next[key];
      return next;
    });
  }

  function setReceiptDiscount(text: string) {
    setReceiptDiscountText(text);
    setReceiptDiscountError(null);
  }

  function remove(key: number) {
    setDrafts(current => current.filter(d => d.key !== key));
    setErrors(current => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function refresh(ids: number[]) {
    ids.forEach(id => queryClient.removeQueries({ queryKey: queryKeys.expense(spaceId, id) }));
    await queryClient.invalidateQueries({ queryKey: queryKeys.expenses(spaceId), exact: true });
  }

  /** Saves changed and removed lines. Returns true when there was nothing left to fix. */
  async function save(): Promise<boolean> {
    const found: Record<number, DraftErrors> = {};
    for (const draft of drafts) {
      // The date isn't editable here, so don't block saving on it.
      const { date: _date, ...lineErrors } = validateDraft(draft);
      if (hasErrors(lineErrors)) found[draft.key] = lineErrors;
    }
    const receiptError = receiptId != null ? receiptDiscountTextError(drafts.map(toLine), receiptDiscount) : null;
    setErrors(found);
    setReceiptDiscountError(receiptError);
    if (hasErrors(found) || receiptError != null) return false;

    const kept = new Set(drafts.map(d => d.key));
    const removedIds = originals.filter(e => !kept.has(e.id)).map(e => e.id);
    const changed = drafts
      .map(draft => ({ id: draft.key, command: toUpdateCommand({ ...draft, merchant }) }))
      .filter(({ id, command }) => {
        const original = originals.find(e => e.id === id);
        return (
          !original ||
          original.unitPrice !== command.unitPrice ||
          original.quantity !== command.quantity ||
          original.category !== command.category ||
          original.description !== command.description ||
          (original.merchant ?? null) !== command.merchant ||
          (original.discount ?? 0) !== command.discount
        );
      });
    const newReceiptDiscount = parseDiscount(receiptDiscount) || 0;
    const receiptDiscountChanged = receiptId != null && newReceiptDiscount !== savedReceiptDiscount;

    if (changed.length === 0 && removedIds.length === 0 && !receiptDiscountChanged) return true;

    setSaving(true);
    setSaveError(null);
    try {
      const results: PromiseSettledResult<void>[] = await Promise.allSettled([
        ...changed.map(({ id, command }) => updateExpense(api, spaceId, id, command)),
        ...removedIds.map(id => deleteExpense(api, spaceId, id)),
      ]);
      // After the lines, so the server checks the receipt discount against what is left.
      if (receiptDiscountChanged && !results.some(r => r.status === 'rejected')) {
        results.push(
          ...(await Promise.allSettled([updateReceiptDiscount(api, spaceId, receiptId, newReceiptDiscount)])),
        );
      }
      await refresh([...changed.map(c => c.id), ...removedIds]);

      if (results.every(r => r.status === 'fulfilled')) return true;
      setSaveError(
        results.some(r => r.status === 'fulfilled')
          ? 'Some changes saved but not all. Check the receipt and try again.'
          : 'Failed to save the receipt. Please try again.',
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  /** Deletes every line of the receipt. Returns true when all were deleted. */
  async function deleteReceipt(): Promise<boolean> {
    setSaving(true);
    setSaveError(null);
    try {
      const ids = originals.map(e => e.id);
      const results = await Promise.allSettled(ids.map(id => deleteExpense(api, spaceId, id)));
      await refresh(ids);

      if (results.every(r => r.status === 'fulfilled')) return true;
      setSaveError('Failed to delete the whole receipt. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    merchant,
    setMerchant,
    drafts,
    errors,
    receiptId,
    receiptDiscount,
    receiptDiscountError,
    setReceiptDiscount,
    saveError,
    saving,
    update,
    remove,
    save,
    deleteReceipt,
  };
}
