import { ApiError } from './apiClient';

/**
 * Reads the message out of the API's error body (ExceptionHandlingMiddleware):
 * domain / forbidden / not-found errors send `{ "error": "..." }`, validation failures send
 * `{ "errors": [{ "field", "message" }] }`. Falls back when neither is present.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as { error?: unknown; errors?: { message?: unknown }[] };
      if (typeof body.error === 'string' && body.error.trim()) return body.error;
      const firstValidationMessage = body.errors?.find(e => typeof e.message === 'string')?.message;
      if (typeof firstValidationMessage === 'string' && firstValidationMessage.trim()) return firstValidationMessage;
    } catch {
      // Not JSON — fall through to the generic message.
    }
  }
  return fallback;
}
