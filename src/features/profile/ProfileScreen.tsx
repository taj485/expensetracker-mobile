import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { env } from '@/config/env';
import { isUserCancelled } from '@/core/auth/authErrors';
import { useSession } from '@/core/auth/useSession';
import { useAiReceiptConsent, useDeleteAccount, useWithdrawAiReceiptConsent } from '@/core/queries/accountQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { AppText } from '@/shared/components/AppText';
import { Avatar } from '@/shared/components/Avatar';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { KeyValueList } from '@/shared/components/KeyValueList';
import { ScrollScreen } from '@/shared/components/Screen';
import { confirm } from '@/shared/utils/confirm';
import { spacing } from '@/theme';

export function ProfileScreen() {
  const { user, signOut: endSession } = useSession();
  const { spaces } = useSelectedSpace();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteAccount = useDeleteAccount();
  const aiConsent = useAiReceiptConsent();
  const withdrawAiConsent = useWithdrawAiReceiptConsent();
  const aiConsentGiven = aiConsent.data?.given === true;

  async function signOut() {
    setSigningOut(true);
    setError(null);
    try {
      // Clears the Auth0 browser session and the stored credentials; the root layout then shows welcome.
      await endSession();
    } catch (e) {
      // iOS asks before opening the logout browser; declining leaves the user signed in.
      if (!isUserCancelled(e)) {
        setError('Sign-out failed. Please try again.');
      }
    } finally {
      setSigningOut(false);
    }
  }

  async function confirmDeleteAccount() {
    const confirmed = await confirm({
      title: 'Delete your account?',
      message:
        "This permanently deletes your Recave account, your personal spaces and their expenses and receipt photos. You'll be removed from spaces you share with others. This can't be undone.",
      confirmLabel: 'Delete account',
      destructive: true,
    });
    if (confirmed) {
      deleteAccount.mutate();
    }
  }

  async function confirmTurnOffAiReading() {
    // Consent is given from the scan sheet, so the row does nothing while it's off.
    if (!aiConsentGiven || withdrawAiConsent.isPending) return;
    const confirmed = await confirm({
      title: 'Turn off AI receipt reading?',
      message: "Recave will stop sending receipt photos to Google Gemini. You'll be asked again the next time you scan.",
      confirmLabel: 'Turn off',
      destructive: true,
    });
    if (confirmed) {
      withdrawAiConsent.mutate(undefined, {
        onError: () =>
          Alert.alert("Couldn't turn off AI receipt reading. Check your connection and try again."),
      });
    }
  }

  return (
    <ScrollScreen>
      <Card style={styles.account}>
        <Avatar name={user?.name} size={56} />
        <View style={styles.accountText}>
          <AppText variant="headline">{user?.name}</AppText>
          <AppText variant="subhead" tone="secondary">
            {user?.email}
          </AppText>
        </View>
      </Card>

      <KeyValueList
        items={[
          { label: 'Spaces', value: String(spaces.length) },
          {
            label: 'AI receipt reading',
            value: aiConsent.data ? (aiConsentGiven ? 'Allowed' : 'Off') : '—',
            onPress: confirmTurnOffAiReading,
          },
          { label: 'Version', value: Constants.expoConfig?.version ?? '—' },
          ...(env.useSampleData ? [{ label: 'Data', value: 'Sample data' }] : []),
        ]}
      />

      <Button title="Sign out" variant="secondary" onPress={signOut} loading={signingOut} />
      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}

      <Button
        title="Delete account"
        variant="danger"
        onPress={confirmDeleteAccount}
        loading={deleteAccount.isPending}
        disabled={signingOut}
      />
      {deleteAccount.isError && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {"Couldn't delete your account. Check your connection and try again."}
        </AppText>
      )}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  account: { flexDirection: 'row', alignItems: 'center', gap: spacing.base, padding: spacing.base, marginBottom: spacing.base },
  accountText: { flex: 1, gap: spacing['2xs'] },
});
