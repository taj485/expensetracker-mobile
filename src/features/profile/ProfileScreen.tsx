import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { env } from '@/config/env';
import { isUserCancelled } from '@/core/auth/authErrors';
import { useSession } from '@/core/auth/useSession';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { AppText } from '@/shared/components/AppText';
import { Avatar } from '@/shared/components/Avatar';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { KeyValueList } from '@/shared/components/KeyValueList';
import { ScrollScreen } from '@/shared/components/Screen';
import { spacing } from '@/theme';

export function ProfileScreen() {
  const { user, signOut: endSession } = useSession();
  const { spaces } = useSelectedSpace();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          { label: 'Version', value: Constants.expoConfig?.version ?? '—' },
          ...(env.useSampleData ? [{ label: 'Data', value: 'Sample data' }] : []),
        ]}
      />

      <Button title="Sign out" variant="secondary" onPress={signOut} loading={signingOut} style={styles.signOut} />
      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert" style={styles.error}>
          {error}
        </AppText>
      )}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  account: { flexDirection: 'row', alignItems: 'center', gap: spacing.base, padding: spacing.base, marginBottom: spacing.base },
  accountText: { flex: 1, gap: spacing['2xs'] },
  // Sets Sign out apart from the account details above it.
  signOut: { marginTop: spacing.xl },
  error: { marginTop: spacing.sm },
});
