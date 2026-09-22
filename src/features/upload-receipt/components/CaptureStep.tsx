import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { radius, spacing, type Theme, useThemedStyles } from '@/theme';

import type { PhotoSource } from '../utils/receiptPhoto';
import { ReceiptFrame } from './ReceiptFrame';

interface CaptureStepProps {
  error: string | null;
  onPick: (source: PhotoSource) => void;
}

export function CaptureStep({ error, onPick }: CaptureStepProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Scan receipt
        </AppText>
        <AppText variant="subhead" tone="secondary">
          {"Snap a photo or choose one — we'll find the expenses for you."}
        </AppText>
      </View>

      <ReceiptFrame>
        <View style={styles.guide}>
          <AppText variant="footnote" style={styles.guideText}>
            Lay the receipt flat in good light, with every line in shot
          </AppText>
        </View>
      </ReceiptFrame>

      <View style={styles.note}>
        <AppText variant="footnote" importantForAccessibility="no">
          ✨
        </AppText>
        <AppText variant="footnote" tone="brand" style={styles.noteText}>
          {"Items, merchant and totals are pulled out automatically. You can check everything before it's saved."}
        </AppText>
      </View>

      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}

      <View style={styles.actions}>
        <Button title="Choose photo" variant="secondary" onPress={() => onPick('library')} style={styles.action} />
        <Button title="Take photo" onPress={() => onPick('camera')} style={styles.action} />
      </View>
    </>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    header: { gap: spacing.xs },
    guide: {
      width: '65%',
      height: '85%',
      borderRadius: radius.md,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.base,
    },
    guideText: { color: 'rgba(255, 255, 255, 0.75)', textAlign: 'center' },
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
