import type { ApiClient } from '@/core/api/apiClient';
import type {
  CreateExpenseTableCommand,
  ExpenseTable,
  ExpenseTableMember,
  InviteUserToTableCommand,
} from '@/core/models/expense-table.model';

// Expense tables are called "spaces" in the UI.

// API CALL: GET /api/expensetable — loads the current user's expense tables
export function getTables(api: ApiClient): Promise<ExpenseTable[]> {
  return api.get<ExpenseTable[]>('/expensetable');
}

// API CALL: POST /api/expensetable — creates a new expense table
export function createTable(api: ApiClient, command: CreateExpenseTableCommand): Promise<{ id: number }> {
  return api.post<{ id: number }>('/expensetable', command);
}

// API CALL: POST /api/expensetable/{id}/star — stars a table (the server clears any other starred table)
export function starTable(api: ApiClient, tableId: number): Promise<void> {
  return api.post<void>(`/expensetable/${tableId}/star`);
}

// API CALL: DELETE /api/expensetable/{id}/star — unstars a table
export function unstarTable(api: ApiClient, tableId: number): Promise<void> {
  return api.delete<void>(`/expensetable/${tableId}/star`);
}

// API CALL: GET /api/expensetable/{id}/members — lists the table's members (admins first, then by email)
export function getMembers(api: ApiClient, tableId: number): Promise<ExpenseTableMember[]> {
  return api.get<ExpenseTableMember[]>(`/expensetable/${tableId}/members`);
}

// API CALL: POST /api/expensetable/{id}/members — invites an existing user (by email) onto the table
export function inviteMember(api: ApiClient, command: InviteUserToTableCommand): Promise<void> {
  return api.post<void>(`/expensetable/${command.expenseTableId}/members`, command);
}

// API CALL: DELETE /api/expensetable/{id} — deletes a table and every expense in it
export function deleteTable(api: ApiClient, tableId: number): Promise<void> {
  return api.delete<void>(`/expensetable/${tableId}`);
}
