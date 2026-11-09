import type { ApiClient } from '@/core/api/apiClient';

// API CALL: DELETE /api/account — permanently deletes the caller's account and personal data (204)
export function deleteAccount(api: ApiClient): Promise<void> {
  return api.delete<void>('/account');
}
