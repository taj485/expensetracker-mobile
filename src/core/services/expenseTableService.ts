import type { ApiClient } from '@/core/api/apiClient';
import type { CreateExpenseTableCommand, ExpenseTable } from '@/core/models/expense-table.model';

// API CALL: GET /api/expensetable — loads the current user's expense tables
export function getTables(api: ApiClient): Promise<ExpenseTable[]> {
  return api.get<ExpenseTable[]>('/expensetable');
}

// API CALL: POST /api/expensetable — creates a new expense table
export function createTable(api: ApiClient, command: CreateExpenseTableCommand): Promise<{ id: number }> {
  return api.post<{ id: number }>('/expensetable', command);
}
