import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '@/core/api/useApiClient';
import type { ExpenseTable } from '@/core/models/expense-table.model';
import { getTables, starTable, unstarTable } from '@/core/services/expenseTableService';

import { queryKeys } from './queryKeys';

export function useSpaces() {
  const api = useApiClient();
  return useQuery({ queryKey: queryKeys.spaces, queryFn: () => getTables(api) });
}

export function useToggleStar() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (space: ExpenseTable) => (space.isStarred ? unstarTable(api, space.id) : starTable(api, space.id)),
    // Only one space can be starred — the server clears the others — so refetch the list.
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.spaces }),
  });
}
