import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '@/core/api/useApiClient';
import type { Expense } from '@/core/models/expense.model';
import { deleteExpense, getExpense, getExpenses } from '@/core/services/expenseService';

import { queryKeys } from './queryKeys';

export function useSpaceExpenses(spaceId: number | null) {
  const api = useApiClient();
  return useQuery({
    queryKey: queryKeys.expenses(spaceId ?? 0),
    queryFn: () => getExpenses(api, spaceId!),
    enabled: spaceId != null,
  });
}

export function useExpense(spaceId: number, expenseId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.expense(spaceId, expenseId),
    queryFn: () => getExpense(api, spaceId, expenseId),
    // Show the row from the already-loaded list instantly while the detail request runs.
    placeholderData: () =>
      queryClient.getQueryData<Expense[]>(queryKeys.expenses(spaceId))?.find(e => e.id === expenseId),
  });
}

export function useDeleteExpense(spaceId: number) {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: number) => deleteExpense(api, spaceId, expenseId),
    onSuccess: (_, expenseId) => {
      queryClient.setQueryData<Expense[]>(queryKeys.expenses(spaceId), list => list?.filter(e => e.id !== expenseId));
      queryClient.removeQueries({ queryKey: queryKeys.expense(spaceId, expenseId) });
    },
  });
}
