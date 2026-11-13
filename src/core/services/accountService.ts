import type { ApiClient } from '@/core/api/apiClient';
import { AI_RECEIPT_CONSENT_VERSION, type AiReceiptConsent } from '@/core/models/account.model';

// API CALL: DELETE /api/account — permanently deletes the caller's account and personal data (204)
export function deleteAccount(api: ApiClient): Promise<void> {
  return api.delete<void>('/account');
}

// API CALL: GET /api/account/ai-receipt-consent — whether the caller allowed AI receipt reading
export function getAiReceiptConsent(api: ApiClient): Promise<AiReceiptConsent> {
  return api.get<AiReceiptConsent>('/account/ai-receipt-consent');
}

// API CALL: PUT /api/account/ai-receipt-consent — records consent to this build's text version (204)
export function giveAiReceiptConsent(api: ApiClient): Promise<void> {
  return api.put<void>('/account/ai-receipt-consent', { version: AI_RECEIPT_CONSENT_VERSION });
}

// API CALL: DELETE /api/account/ai-receipt-consent — withdraws the consent (204)
export function withdrawAiReceiptConsent(api: ApiClient): Promise<void> {
  return api.delete<void>('/account/ai-receipt-consent');
}
