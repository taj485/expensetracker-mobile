import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { spacing } from '@/theme';

import type { ReceiptPhoto } from '../utils/receiptPhoto';
import { ReceiptFrame } from './ReceiptFrame';

interface ReadingStepProps {
  photo: ReceiptPhoto | null;
  onCancel: () => void;
}

/** The chosen photo, dimmed, while the API reads it. */
export function ReadingStep({ photo, onCancel }: ReadingStepProps) {
  return (
    <>
      <AppText variant="title3" weight="700" accessibilityRole="header">
        Reading your receipt…
      </AppText>
      <ReceiptFrame>
        {photo && <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} contentFit="contain" />}
        <View style={styles.overlay} accessible accessibilityLabel="Reading your receipt" accessibilityRole="progressbar">
          <ActivityIndicator color="#FFFFFF" size="large" />
          <AppText variant="subhead" weight="600" style={styles.text}>
            Finding items, prices and the merchant
          </AppText>
        </View>
      </ReceiptFrame>
      <Button title="Cancel" variant="secondary" onPress={onCancel} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23, 21, 38, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  text: { color: '#FFFFFF', textAlign: 'center' },
});
