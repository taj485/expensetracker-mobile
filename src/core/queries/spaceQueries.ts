import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '@/core/api/useApiClient';
import type {
  CreateExpenseTableCommand,
  ExpenseTable,
  InviteUserToTableCommand,
} from '@/core/models/expense-table.model';
import {
  createTable,
  deleteTable,
  getMembers,
  getTables,
  inviteMember,
  starTable,
  unstarTable,
} from '@/core/services/expenseTableService';

import { queryKeys } from './queryKeys';

// Members and expenses keys start with ['spaces', id], so refreshing the spaces list must be
// exact — otherwise every space mutation would also refetch every loaded expense list.
const SPACES_LIST = { queryKey: queryKeys.spaces, exact: true } as const;

export function useSpaces() {
  const api = useApiClient();
  return useQuery({ queryKey: queryKeys.spaces, queryFn: () => getTables(api) });
}

export function useSpaceMembers(spaceId: number | null) {
  const api = useApiClient();
  return useQuery({
    queryKey: queryKeys.members(spaceId ?? 0),
    queryFn: () => {
      if (spaceId == null) throw new Error('No space selected');
      return getMembers(api, spaceId);
    },
    enabled: spaceId != null,
  });
}

export function useCreateSpace() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: CreateExpenseTableCommand) => createTable(api, command),
    // Awaited so callers see the new space in the list by the time onSuccess resolves.
    onSuccess: () => queryClient.invalidateQueries(SPACES_LIST),
  });
}

export function useInviteMember() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: InviteUserToTableCommand) => inviteMember(api, command),
    // The member list, and the member count on the spaces list.
    onSuccess: (_, command) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.members(command.expenseTableId) }),
        queryClient.invalidateQueries(SPACES_LIST),
      ]),
  });
}

export function useDeleteSpace() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spaceId: number) => deleteTable(api, spaceId),
    onSuccess: async (_, spaceId) => {
      queryClient.removeQueries({ queryKey: queryKeys.expenses(spaceId) });
      queryClient.removeQueries({ queryKey: queryKeys.members(spaceId) });
      // The selected-space provider falls back to the starred/first space once this refetches;
      // deleting the last space sends the user to "create your first space".
      await queryClient.invalidateQueries(SPACES_LIST);
    },
  });
}

export function useToggleStar() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (space: ExpenseTable) => (space.isStarred ? unstarTable(api, space.id) : starTable(api, space.id)),
    // Only one space can be starred — the server clears the others — so refetch the list.
    onSettled: () => queryClient.invalidateQueries(SPACES_LIST),
  });
}
