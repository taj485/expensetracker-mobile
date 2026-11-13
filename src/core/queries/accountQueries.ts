import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

import { env } from '@/config/env';
import { useApiClient } from '@/core/api/useApiClient';
import { markAccountDeleted } from '@/core/auth/accountDeletedNotice';
import { AI_RECEIPT_CONSENT_VERSION, type AiReceiptConsent } from '@/core/models/account.model';
import {
  deleteAccount,
  getAiReceiptConsent,
  giveAiReceiptConsent,
  withdrawAiReceiptConsent,
} from '@/core/services/accountService';

import { queryKeys } from './queryKeys';

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

/** Whether this account allowed sending receipt photos to Google Gemini. */
export function useAiReceiptConsent() {
  const api = useApiClient();
  return useQuery({
    queryKey: queryKeys.aiReceiptConsent,
    queryFn: () => getAiReceiptConsent(api),
    // Consent can change on another phone; always check with the server when a screen opens.
    refetchOnMount: 'always',
  });
}

/** Records consent on the server; the cached status flips to given only once the server confirms. */
export function useGiveAiReceiptConsent() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => giveAiReceiptConsent(api),
    onSuccess: () => {
      queryClient.setQueryData<AiReceiptConsent>(queryKeys.aiReceiptConsent, current => ({
        given: true,
        version: AI_RECEIPT_CONSENT_VERSION,
        // Giving it again keeps the server's original date.
        givenAt: current?.given ? current.givenAt : new Date().toISOString(),
      }));
    },
  });
}

/** Withdraws consent on the server; the next scan asks again. */
export function useWithdrawAiReceiptConsent() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => withdrawAiReceiptConsent(api),
    onSuccess: () => {
      queryClient.setQueryData<AiReceiptConsent>(queryKeys.aiReceiptConsent, {
        given: false,
        version: null,
        givenAt: null,
      });
    },
  });
}
