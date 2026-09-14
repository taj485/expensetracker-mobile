import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

import type { ExpenseTable } from '@/core/models/expense-table.model';
import { useSpaces } from '@/core/queries/spaceQueries';

interface SelectedSpaceContextValue {
  spaces: ExpenseTable[];
  /** The space Home and Expenses show: the user's pick, else the starred space, else the first. */
  selectedSpace: ExpenseTable | null;
  selectSpace: (spaceId: number) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

const SelectedSpaceContext = createContext<SelectedSpaceContextValue | null>(null);

export function SelectedSpaceProvider({ children }: { children: ReactNode }) {
  const { data: spaces = [], isLoading, error, refetch } = useSpaces();
  const [pickedId, setPickedId] = useState<number | null>(null);

  const value = useMemo<SelectedSpaceContextValue>(() => {
    // Fall back when the picked space no longer exists (deleted, or access removed).
    const selectedSpace =
      spaces.find(s => s.id === pickedId) ?? spaces.find(s => s.isStarred) ?? spaces[0] ?? null;
    return { spaces, selectedSpace, selectSpace: setPickedId, isLoading, error, refetch };
  }, [spaces, pickedId, isLoading, error, refetch]);

  return <SelectedSpaceContext.Provider value={value}>{children}</SelectedSpaceContext.Provider>;
}

export function useSelectedSpace(): SelectedSpaceContextValue {
  const context = useContext(SelectedSpaceContext);
  if (!context) {
    throw new Error('useSelectedSpace must be used inside SelectedSpaceProvider');
  }
  return context;
}
