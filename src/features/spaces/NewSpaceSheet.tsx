import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { CreateSpaceForm } from './components/CreateSpaceForm';

/** "+ New space" from the sidebar. Creating selects the new space and closes the sheet. */
export function NewSpaceSheet() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <SheetHandle />
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          New space
        </AppText>
        <AppText variant="subhead" tone="secondary">
          Keep a separate set of expenses — for a trip, work, or a shared household.
        </AppText>
      </View>
      <CreateSpaceForm onCreated={() => router.back()} />
    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
    header: { gap: spacing.xs },
  });
