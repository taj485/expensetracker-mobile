import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

import { isUserCancelled } from '@/core/auth/authErrors';
import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { colors, spacing, typography } from '@/theme';

export function SettingsScreen() {
  const { user, clearSession } = useAuth0();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setSigningOut(true);
    setError(null);
    try {
      // Clears the Auth0 browser session and the stored credentials; the root layout then shows login.
      await clearSession();
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
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.account}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <Button title="Sign out" variant="secondary" onPress={signOut} loading={signingOut} />
      {error && <Text style={styles.error}>{error}</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.textPrimary },
  account: { gap: spacing.xs, marginBottom: spacing.md },
  name: { ...typography.heading, color: colors.textPrimary },
  email: { ...typography.body, color: colors.textSecondary },
  error: { ...typography.label, color: colors.textNegative },
});
