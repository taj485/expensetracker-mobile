import { Alert } from 'react-native';
import { useAuth0, type User } from 'react-native-auth0';

import { env } from '@/config/env';
import { SAMPLE_USER } from '@/core/sample/sampleData';

interface Session {
  user: User | null;
  isLoading: boolean;
  /** Clears the Auth0 session and stored credentials. Throws WebAuthError if the user cancels. */
  signOut: () => Promise<void>;
}

/**
 * The signed-in user, from Auth0 — or, in the dev-only sample mode, a fixed sample user so the
 * app can be explored without logging in.
 */
export function useSession(): Session {
  const { user, isLoading, clearSession } = useAuth0();

  // SAMPLE-DATA — env.useSampleData is a build-time constant, so the hook order never changes.
  if (env.useSampleData) {
    return {
      user: SAMPLE_USER,
      isLoading: false,
      signOut: async () => {
        Alert.alert('Sample data mode', 'Sign-out is disabled. Remove EXPO_PUBLIC_USE_SAMPLE_DATA to use real accounts.');
      },
    };
  }

  return { user: user ?? null, isLoading, signOut: () => clearSession() };
}
