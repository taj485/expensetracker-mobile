/** GET /api/account/ai-receipt-consent. `givenAt` is an ISO date (UTC). */
export interface AiReceiptConsent {
  given: boolean;
  version: number | null;
  givenAt: string | null;
}

/** The consent text version this build shows. Raise it with the API's AiReceiptConsent.CurrentVersion. */
export const AI_RECEIPT_CONSENT_VERSION = 1;
