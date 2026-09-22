import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { apiErrorMessage } from '@/core/api/apiErrors';
import { useApiClient } from '@/core/api/useApiClient';
import { isSessionEnded } from '@/core/auth/authErrors';
import { queryKeys } from '@/core/queries/queryKeys';
import { addExpensesBatch, extractReceipt, uploadReceiptImage } from '@/core/services/expenseService';
import { type DraftErrors, type DraftExpense, toCommand, toDraft, validateDraft } from '@/core/utils/expenseDraft';
import { confirm } from '@/shared/utils/confirm';

import { pickReceiptPhoto, type PhotoSource, type ReceiptPhoto } from '../utils/receiptPhoto';

export type ScanStep = 'capture' | 'reading' | 'review' | 'spaces';

/**
 * useApiClient has already signed the user out and the app is heading to /login, taking this
 * sheet with it — so explain in an alert, which outlives the sheet, rather than inline.
 */
function explainSessionEnded() {
  void confirm({
    title: 'Please sign in again',
    message: "Your session has ended. Anything from this receipt that wasn't saved will need scanning again.",
    confirmLabel: 'OK',
  });
}

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
  const [photoUploadFailed, setPhotoUploadFailed] = useState(false);
  // Started alongside extraction so the photo is usually stored by the time the user saves.
  const imageReference = useRef<Promise<string | null> | null>(null);
  // Aborts the current scan's uploads when the user cancels, retakes or closes the sheet.
  const scanAbort = useRef<AbortController | null>(null);

  useEffect(() => () => scanAbort.current?.abort(), []);

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

    const controller = new AbortController();
    scanAbort.current = controller;
    setPhoto(picked);
    setStep('reading');

    try {
      const items = await extractReceipt(api, extractSpaceId, picked.uri, picked.fileName, controller.signal);
      // Cancelled or closed while reading (sample data ignores the signal, so check here too).
      if (controller.signal.aborted) return;
      if (items.length === 0) {
        setError("We couldn't find any expenses on that receipt. Try a clearer photo.");
        reset();
        return;
      }
      setDrafts(items.map(toDraft));
      setDraftErrors({});
      setStep('review');
      // A failed image upload shouldn't block saving the expenses themselves — they're saved
      // without a photo, and the review step says so. Cancels and session ends aren't failures.
      imageReference.current = uploadReceiptImage(
        api,
        extractSpaceId,
        picked.uri,
        picked.fileName,
        controller.signal,
      ).catch(e => {
        if (!controller.signal.aborted && !isSessionEnded(e)) setPhotoUploadFailed(true);
        return null;
      });
    } catch (e) {
      // A cancel is the user's choice, not a failure.
      if (controller.signal.aborted) return;
      if (isSessionEnded(e)) {
        explainSessionEnded();
        return;
      }
      setError(apiErrorMessage(e, "Couldn't read this receipt. Try a different photo."));
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
    } catch (e) {
      if (isSessionEnded(e)) {
        explainSessionEnded();
        return false;
      }
      setError(apiErrorMessage(e, 'Failed to add the expenses. Please try again.'));
      return false;
    } finally {
      setSaving(false);
    }
  }

  /** Back to the capture step, abandoning the current photo, its drafts and any upload in flight. */
  function reset() {
    scanAbort.current?.abort();
    scanAbort.current = null;
    setStep('capture');
    setPhoto(null);
    setDrafts([]);
    setDraftErrors({});
    setPhotoUploadFailed(false);
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
    photoUploadFailed,
    start,
    updateDraft,
    removeDraft,
    continueToSpaces,
    save,
    reset,
  };
}
