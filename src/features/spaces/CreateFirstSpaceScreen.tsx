import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isUserCancelled } from '@/core/auth/authErrors';
import { useSession } from '@/core/auth/useSession';
import { AppText } from '@/shared/components/AppText';
import { Mascot } from '@/shared/icons/Mascot';
import { spacing, useTheme } from '@/theme';

import { CreateSpaceForm } from './components/CreateSpaceForm';

/**
 * Shown after login when the user has no spaces — nothing else in the app works without one.
 * Mirrors the web shell's non-dismissible "create your expense table" prompt.
 */
export function CreateFirstSpaceScreen() {
  const { colors } = useTheme();
  const { signOut: endSession } = useSession();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function signOut() {
    setSignOutError(null);
    try {
      await endSession();
    } catch (e) {
      if (!isUserCancelled(e)) setSignOutError('Sign-out failed. Please try again.');
    }
  }

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.bgPage }]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Mascot width={96} />
            <AppText variant="title1" accessibilityRole="header" style={styles.centered}>
              Create your first space
            </AppText>
            <AppText variant="body" tone="secondary" style={styles.centered}>
              {"Spaces keep expenses apart — one for home, work or a trip. You'll need one before you can start tracking."}
            </AppText>
          </View>

          <CreateSpaceForm />

          <View style={styles.footer}>
            <Pressable accessibilityRole="button" onPress={signOut} hitSlop={spacing.sm}>
              <AppText variant="subhead" weight="600" tone="brand">
                Sign out
              </AppText>
            </Pressable>
            {signOutError && (
              <AppText variant="footnote" tone="negative" accessibilityRole="alert">
                {signOutError}
              </AppText>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing['2xl'] },
  intro: { alignItems: 'center', gap: spacing.md },
  centered: { textAlign: 'center' },
  footer: { alignItems: 'center', gap: spacing.sm },
});
