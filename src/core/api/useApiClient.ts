import { useMemo } from 'react';
import { useAuth0 } from 'react-native-auth0';

import { env } from '@/config/env';
import { AUTH_AUDIENCE, AUTH_SCOPE } from '@/core/auth/authConfig';
import { isSessionEnded } from '@/core/auth/authErrors';
import { sampleApiClient } from '@/core/sample/sampleApiClient';

import { createApiClient } from './apiClient';

export function useApiClient() {
  const { getCredentials, clearCredentials } = useAuth0();

  return useMemo(() => {
    // SAMPLE-DATA — serve built-in fake data instead of calling ExpenseTrackerAPI.
    if (env.useSampleData) return sampleApiClient;

    return createApiClient(async () => {
      try {
        // Returns the stored token, silently refreshing it with the refresh token when expired.
        const credentials = await getCredentials(AUTH_SCOPE, 0, { audience: AUTH_AUDIENCE });
        return credentials.accessToken;
      } catch (error) {
        if (isSessionEnded(error)) {
          // Clears local credentials only (no browser redirect); `user` becomes null
          // and the root layout's guard sends the user back to /login.
          await clearCredentials();
        }
        throw error;
      }
    });
  }, [getCredentials, clearCredentials]);
}
