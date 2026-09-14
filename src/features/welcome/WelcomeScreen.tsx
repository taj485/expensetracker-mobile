import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AUTH_AUDIENCE, AUTH_SCOPE } from '@/core/auth/authConfig';
import { isUserCancelled } from '@/core/auth/authErrors';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Wordmark } from '@/shared/components/Wordmark';
import { InsightsIcon, ScanIcon, SpacesIcon } from '@/shared/icons/AppIcons';
import { Mascot } from '@/shared/icons/Mascot';
import { purple, spacing } from '@/theme';

import { FeatureRow } from './components/FeatureRow';

type AuthMode = 'signup' | 'login';

/** Logged-out screen from the mockup. Both buttons open Auth0 Universal Login. */
export function WelcomeScreen() {
  const { authorize } = useAuth0();
  const [pending, setPending] = useState<AuthMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openAuth(mode: AuthMode) {
    setPending(mode);
    setError(null);
    try {
      await authorize({
        audience: AUTH_AUDIENCE,
        scope: AUTH_SCOPE,
        // Opens Universal Login on the sign-up tab for new users.
        ...(mode === 'signup' && { additionalParameters: { screen_hint: 'signup' } }),
      });
    } catch (e) {
      // Closing the login browser is a normal choice, not an error worth showing.
      if (!isUserCancelled(e)) {
        setError('Sign-in failed. Please check your connection and try again.');
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <LinearGradient colors={[purple[800], purple[900]]} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.fill}>
      <StatusBar style="light" />
      <View style={styles.glow} pointerEvents="none" />

      <SafeAreaView style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={styles.hero}>
            <Mascot width={168} />
            <Wordmark onBrand size={34} />
            <AppText variant="subhead" style={styles.tagline}>
              Receipts in. <AppText variant="subhead" weight="600" tone="onBrand">Insights out.</AppText>
            </AppText>
          </View>

          <View style={styles.features}>
            <FeatureRow Icon={ScanIcon} text="Snap a receipt — every line item read for you" />
            <FeatureRow Icon={SpacesIcon} text="Separate spaces for home, work and trips" />
            <FeatureRow Icon={InsightsIcon} text="See where the month actually went" />
          </View>

          <View style={styles.actions}>
            <Button
              title="Get started"
              variant="onBrand"
              onPress={() => openAuth('signup')}
              loading={pending === 'signup'}
              disabled={pending !== null}
            />
            <Button
              title="I already have an account"
              variant="ghostOnBrand"
              onPress={() => openAuth('login')}
              loading={pending === 'login'}
              disabled={pending !== null}
            />
            {error && (
              <AppText variant="footnote" tone="onBrand" style={styles.error} accessibilityRole="alert">
                {error}
              </AppText>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // Stands in for the mockup's radial highlight behind the mascot.
  glow: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: purple[700],
    opacity: 0.45,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.base, paddingTop: spacing['2xl'] },
  tagline: { color: purple[200], textAlign: 'center' },
  features: { gap: spacing.md },
  actions: { gap: spacing.md },
  error: { textAlign: 'center' },
});
