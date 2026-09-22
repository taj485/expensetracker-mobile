import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { useApiClient } from '@/core/api/useApiClient';
import { queryKeys } from '@/core/queries/queryKeys';
import { addExpensesBatch, extractReceipt, uploadReceiptImage } from '@/core/services/expenseService';
import { type DraftErrors, type DraftExpense, toCommand, toDraft, validateDraft } from '@/core/utils/expenseDraft';

import { pickReceiptPhoto, type PhotoSource, type ReceiptPhoto } from '../utils/receiptPhoto';

export type ScanStep = 'capture' | 'reading' | 'review' | 'spaces';

/**
 * Receipt scanning flow, mirroring the web upload-receipt component:
 * photo → shrink to JPEG → extract line items → review/edit → pick spaces → batch save.
 */
export function useReceiptScan(extractSpaceId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<ScanStep>('capture');
  const [photo, setPhoto] = useState<ReceiptPhoto | null>(null);
  const [drafts, setDrafts] = useState<DraftExpense[]>([]);
  const [draftErrors, setDraftErrors] = useState<Record<number, DraftErrors>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Started alongside extraction so the photo is usually stored by the time the user saves.
  const imageReference = useRef<Promise<string | null> | null>(null);

  async function start(source: PhotoSource) {
    setError(null);
    let picked: ReceiptPhoto;
    try {
      const result = await pickReceiptPhoto(source);
      if (result.status === 'cancelled') return;
      if (result.status === 'denied') {
        setError('Camera access is off. Allow it in Settings, or choose a photo instead.');
        return;
      }
      picked = result.photo;
    } catch {
      setError("Couldn't open that photo. Try a different one.");
      return;
    }

    setPhoto(picked);
    setStep('reading');

    try {
      const items = await extractReceipt(api, extractSpaceId, picked.uri, picked.fileName);
      if (items.length === 0) {
        setError("We couldn't find any expenses on that receipt. Try a clearer photo.");
        reset();
        return;
      }
      setDrafts(items.map(toDraft));
      setDraftErrors({});
      setStep('review');
      // A failed image upload shouldn't block saving the expenses themselves.
      imageReference.current = uploadReceiptImage(api, extractSpaceId, picked.uri, picked.fileName).catch(() => null);
    } catch {
      setError("Couldn't read this receipt. Try a different photo.");
      setStep('capture');
      setPhoto(null);
    }
  }

  function updateDraft(key: number, patch: Partial<DraftExpense>) {
    setDrafts(list => list.map(d => (d.key === key ? { ...d, ...patch } : d)));
    setDraftErrors(({ [key]: _, ...rest }) => rest);
  }

  function removeDraft(key: number) {
    setDrafts(list => list.filter(d => d.key !== key));
  }

  /** Validates every item; moves on to choosing spaces only if all are valid. */
  function continueToSpaces() {
    const errors = Object.fromEntries(
      drafts.map(d => [d.key, validateDraft(d)] as const).filter(([, e]) => Object.keys(e).length > 0),
    );
    setDraftErrors(errors);
    if (Object.keys(errors).length === 0) setStep('spaces');
    return Object.keys(errors).length === 0;
  }

  /** Adds the reviewed items to each chosen space. Returns true when everything saved. */
  async function save(spaceIds: number[]): Promise<boolean> {
    setSaving(true);
    setError(null);
    try {
      const reference = (await imageReference.current) ?? null;
      const commands = drafts.map(toCommand);
      const results = await Promise.all(spaceIds.map(id => addExpensesBatch(api, id, commands, reference)));

      await Promise.all(spaceIds.map(id => queryClient.invalidateQueries({ queryKey: queryKeys.expenses(id) })));

      const failedIndexes = new Set(results.flatMap(r => r.errors.map(e => e.index)));
      if (failedIndexes.size === 0) return true;

      // Keep only the rejected items on screen so the user can fix and retry them — same as web.
      const messages = results.flatMap(r => r.errors.map(e => `${drafts[e.index]?.description ?? 'Item'}: ${e.errors.join(' ')}`));
      setDrafts(list => list.filter((_, index) => failedIndexes.has(index)));
      setError(messages.join('\n'));
      setStep('review');
      return false;
    } catch {
      setError('Failed to add the expenses. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setStep('capture');
    setPhoto(null);
    setDrafts([]);
    setDraftErrors({});
    imageReference.current = null;
  }

  return {
    step,
    setStep,
    photo,
    drafts,
    draftErrors,
    error,
    saving,
    start,
    updateDraft,
    removeDraft,
    continueToSpaces,
    save,
    reset,
  };
}
