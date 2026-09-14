import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

import { AUTH_AUDIENCE, AUTH_SCOPE } from '@/core/auth/authConfig';
import { isUserCancelled } from '@/core/auth/authErrors';
import { Button } from '@/shared/components/Button';
import { FULL_SCREEN_EDGES, Screen } from '@/shared/components/Screen';
import { colors, spacing, typography } from '@/theme';

export function LoginScreen() {
  const { authorize } = useAuth0();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setSigningIn(true);
    setError(null);
    try {
      // On success useAuth0's `user` updates and the root layout swaps to the tabs.
      await authorize({ audience: AUTH_AUDIENCE, scope: AUTH_SCOPE });
    } catch (e) {
      // Closing the login browser is a normal choice, not an error worth showing.
      if (!isUserCancelled(e)) {
        setError('Sign-in failed. Please check your connection and try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <Screen centered edges={FULL_SCREEN_EDGES}>
      <View style={styles.hero}>
        <Text style={styles.title}>ReceiptCave</Text>
        <Text style={styles.subtitle}>Scan receipts. Track spending. Share tables.</Text>
      </View>
      <Button title="Sign in" onPress={signIn} loading={signingIn} />
      {error && <Text style={styles.error}>{error}</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  title: { ...typography.title, color: colors.textBrand },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  error: { ...typography.label, color: colors.textNegative, textAlign: 'center' },
});
