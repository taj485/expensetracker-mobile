import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useApiClient } from '@/core/api/useApiClient';
import { queryKeys } from '@/core/queries/queryKeys';
import { addExpense } from '@/core/services/expenseService';
import {
  type DraftErrors,
  type DraftExpense,
  emptyDraft,
  hasErrors,
  toCommand,
  validateDraft,
} from '@/core/utils/expenseDraft';

export type AddExpenseStep = 'form' | 'spaces';

/** Add expense flow, mirroring the web form: fill in → validate → pick spaces → save to each. */
export function useAddExpense() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<AddExpenseStep>('form');
  const [draft, setDraft] = useState<DraftExpense>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(patch: Partial<DraftExpense>) {
    setDraft(current => ({ ...current, ...patch }));
    // Clear the error for whichever fields were just edited.
    setErrors(current => {
      const next = { ...current };
      for (const field of Object.keys(patch)) delete next[field as keyof DraftErrors];
      return next;
    });
  }

  function continueToSpaces() {
    const found = validateDraft(draft);
    setErrors(found);
    if (!hasErrors(found)) {
      setSaveError(null);
      setStep('spaces');
    }
  }

  /** Adds the expense to each chosen space. Returns true when every request succeeded. */
  async function save(spaceIds: number[]): Promise<boolean> {
    setSaving(true);
    setSaveError(null);
    const command = toCommand(draft);
    try {
      const results = await Promise.allSettled(spaceIds.map(id => addExpense(api, id, command)));
      await Promise.all(spaceIds.map(id => queryClient.invalidateQueries({ queryKey: queryKeys.expenses(id) })));

      if (results.every(r => r.status === 'fulfilled')) return true;
      setSaveError(
        results.some(r => r.status === 'fulfilled')
          ? 'Added to some spaces but not all. Check your spaces before trying again, to avoid duplicates.'
          : 'Failed to add the expense. Please try again.',
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { step, setStep, draft, errors, saveError, saving, update, continueToSpaces, save };
}
