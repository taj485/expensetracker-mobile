import type { ApiClient } from '@/core/api/apiClient';
import type { Expense } from '@/core/models/expense.model';

const tableUrl = (tableId: number) => `/expensetable/${tableId}/expenses`;

// API CALL: GET /api/expensetable/{tableId}/expenses — loads a table's expenses
export function getExpenses(api: ApiClient, tableId: number): Promise<Expense[]> {
  return api.get<Expense[]>(tableUrl(tableId));
}

// API CALL: GET /api/expensetable/{tableId}/expenses/{id} — fetch a single expense
export function getExpense(api: ApiClient, tableId: number, id: number): Promise<Expense> {
  return api.get<Expense>(`${tableUrl(tableId)}/${id}`);
}

// API CALL: DELETE /api/expensetable/{tableId}/expenses/{id} — delete an expense
export function deleteExpense(api: ApiClient, tableId: number, id: number): Promise<void> {
  return api.delete<void>(`${tableUrl(tableId)}/${id}`);
}
