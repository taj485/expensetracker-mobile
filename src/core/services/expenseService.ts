import type { ApiClient, DownloadedFile } from '@/core/api/apiClient';
import type {
  AddExpenseCommand,
  AddExpensesBatchResult,
  Expense,
  ExtractedExpense,
  UpdateExpenseCommand,
} from '@/core/models/expense.model';
import { appendImageFile } from '@/core/utils/formDataFile';

const tableUrl = (tableId: number) => `/expensetable/${tableId}/expenses`;

// API CALL: GET /api/expensetable/{tableId}/expenses — loads a table's expenses
export function getExpenses(api: ApiClient, tableId: number): Promise<Expense[]> {
  return api.get<Expense[]>(tableUrl(tableId));
}

// API CALL: GET /api/expensetable/{tableId}/expenses/{id} — fetch a single expense
export function getExpense(api: ApiClient, tableId: number, id: number): Promise<Expense> {
  return api.get<Expense>(`${tableUrl(tableId)}/${id}`);
}

// API CALL: POST /api/expensetable/{tableId}/expenses — adds a single expense to a table
export function addExpense(api: ApiClient, tableId: number, command: AddExpenseCommand): Promise<{ id: number }> {
  return api.post<{ id: number }>(tableUrl(tableId), { ...command, expenseTableId: tableId });
}

// API CALL: PUT /api/expensetable/{tableId}/expenses/{id} — updates an expense (the API doesn't change its date)
export function updateExpense(api: ApiClient, tableId: number, id: number, command: UpdateExpenseCommand): Promise<void> {
  return api.put<void>(`${tableUrl(tableId)}/${id}`, { id, ...command });
}

// API CALL: DELETE /api/expensetable/{tableId}/expenses/{id} — delete an expense
export function deleteExpense(api: ApiClient, tableId: number, id: number): Promise<void> {
  return api.delete<void>(`${tableUrl(tableId)}/${id}`);
}

async function imageForm(uri: string, fileName: string): Promise<FormData> {
  const form = new FormData();
  await appendImageFile(form, 'file', uri, fileName);
  return form;
}

// API CALL: POST /api/expensetable/{tableId}/expenses/extract-receipt — reads line items from a receipt photo (multipart)
export async function extractReceipt(
  api: ApiClient,
  tableId: number,
  imageUri: string,
  fileName: string,
  signal?: AbortSignal,
): Promise<ExtractedExpense[]> {
  return api.postForm<ExtractedExpense[]>(`${tableUrl(tableId)}/extract-receipt`, await imageForm(imageUri, fileName), signal);
}

// API CALL: POST /api/expensetable/{tableId}/expenses/receipt-image — stores the receipt photo, returns a reference for the batch
export async function uploadReceiptImage(
  api: ApiClient,
  tableId: number,
  imageUri: string,
  fileName: string,
  signal?: AbortSignal,
): Promise<string> {
  const result = await api.postForm<{ imageReference: string }>(
    `${tableUrl(tableId)}/receipt-image`,
    await imageForm(imageUri, fileName),
    signal,
  );
  return result.imageReference;
}

// API CALL: GET /api/expensetable/{tableId}/expenses/by-receipt/{receiptId}/image — downloads the stored receipt photo (404 when there isn't one)
export function downloadReceiptImage(api: ApiClient, tableId: number, receiptId: number): Promise<DownloadedFile> {
  return api.download(`${tableUrl(tableId)}/by-receipt/${receiptId}/image`);
}

// API CALL: POST /api/expensetable/{tableId}/expenses/batch — adds several expenses (one receipt) to a table
export function addExpensesBatch(
  api: ApiClient,
  tableId: number,
  items: AddExpenseCommand[],
  receiptImageReference: string | null,
): Promise<AddExpensesBatchResult> {
  return api.post<AddExpensesBatchResult>(`${tableUrl(tableId)}/batch`, {
    expenseTableId: tableId,
    items: items.map(item => ({ ...item, expenseTableId: tableId })),
    receiptImageReference,
  });
}
