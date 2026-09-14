import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { radius, spacing, type Theme, useThemedStyles } from '@/theme';

/**
 * Scan receipt sheet from the mockup. Camera capture and extraction arrive in the receipt
 * scanning phase; for now the layout is in place and the actions are disabled.
 */
export function ScanReceiptSheet() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sheet}>
      <AppText variant="title3" weight="700" accessibilityRole="header">
        Scan receipt
      </AppText>

      <View style={styles.frame}>
        <View style={styles.guide}>
          <AppText variant="footnote" style={styles.guideText}>
            Line the receipt up inside the frame
          </AppText>
        </View>
      </View>

      <View style={styles.note}>
        <AppText variant="footnote">✨</AppText>
        <AppText variant="footnote" tone="brand" style={styles.noteText}>
          Items, merchant and totals are pulled out automatically once you capture. Coming soon.
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button title="Choose photo" variant="secondary" onPress={() => {}} disabled style={styles.action} />
        <Button title="Capture" onPress={() => {}} disabled style={styles.action} />
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.base, backgroundColor: colors.bgElevated },
    frame: {
      height: 300,
      borderRadius: radius.xl,
      backgroundColor: '#171526',
      alignItems: 'center',
      justifyContent: 'center',
    },
    guide: {
      width: 200,
      height: 250,
      borderRadius: radius.md,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.base,
    },
    guideText: { color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' },
    note: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderFocus,
      backgroundColor: colors.bgBrandSoft,
    },
    noteText: { flex: 1 },
    actions: { flexDirection: 'row', gap: spacing.md },
    action: { flex: 1 },
  });
