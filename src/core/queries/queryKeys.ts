export const queryKeys = {
  spaces: ['spaces'] as const,
  members: (spaceId: number) => ['spaces', spaceId, 'members'] as const,
  expenses: (spaceId: number) => ['spaces', spaceId, 'expenses'] as const,
  expense: (spaceId: number, expenseId: number) => ['spaces', spaceId, 'expenses', expenseId] as const,
};
