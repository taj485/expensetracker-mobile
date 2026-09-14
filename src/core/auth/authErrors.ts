import {
  CredentialsManagerError,
  CredentialsManagerErrorCodes,
  WebAuthError,
  WebAuthErrorCodes,
} from 'react-native-auth0';

// The SDK normalises native error codes into `type`, so these checks work on iOS and Android alike.

/** The user closed the Auth0 login/logout browser. */
export function isUserCancelled(error: unknown): boolean {
  return error instanceof WebAuthError && error.type === WebAuthErrorCodes.USER_CANCELLED;
}

const SESSION_ENDED_TYPES: string[] = [
  CredentialsManagerErrorCodes.NO_CREDENTIALS,
  CredentialsManagerErrorCodes.NO_REFRESH_TOKEN,
  CredentialsManagerErrorCodes.RENEW_FAILED,
  CredentialsManagerErrorCodes.SESSION_EXPIRED,
];

/**
 * Stored credentials can't produce a token any more (none stored, refresh token
 * revoked/expired, or the session ceiling reached) — the user has to sign in again.
 */
export function isSessionEnded(error: unknown): boolean {
  return error instanceof CredentialsManagerError && SESSION_ENDED_TYPES.includes(error.type);
}
