import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

import { env } from '@/config/env';
import { useApiClient } from '@/core/api/useApiClient';
import { markAccountDeleted } from '@/core/auth/accountDeletedNotice';
import { deleteAccount } from '@/core/services/accountService';

/**
 * Deletes the account on the server, then signs out on this device and shows Welcome with a notice.
 * Resolves false (and changes nothing) in sample-data mode.
 */
export function useDeleteAccount() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { clearCredentials } = useAuth0();

  return useMutation({
    mutationFn: async () => {
      // SAMPLE-DATA — there is no real account to delete.
      if (env.useSampleData) {
        Alert.alert('Sample data mode: account deletion is disabled.');
        return false;
      }
      await deleteAccount(api);
      return true;
    },
    onSuccess: async deleted => {
      if (!deleted) return;
      markAccountDeleted();
      // The Auth0 user is already gone, so clearing the stored credentials is enough; clearSession()
      // would show the iOS "wants to use auth0.com" prompt. `user` becomes null and the root
      // layout's guard shows Welcome.
      await clearCredentials();
      // Nothing from the deleted account may still be on screen or in memory.
      queryClient.clear();
    },
  });
}
