import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { neutral, radius, spacing } from '@/theme';

export const CAPTURE_HINT = 'Lay the receipt flat in good light, with every line in shot';

interface CaptureGuideProps {
  message: string;
  title?: string;
  /** A button for the state's way forward, e.g. Open Settings. */
  children?: ReactNode;
  style?: ViewStyle;
}

/** Dashed receipt outline inside `ReceiptFrame`, with a hint or the camera's state. */
export function CaptureGuide({ message, title, children, style }: CaptureGuideProps) {
  return (
    <View style={[styles.guide, style]}>
      {title && (
        <AppText variant="headline" style={styles.title}>
          {title}
        </AppText>
      )}
      <AppText variant="footnote" style={styles.message}>
        {message}
      </AppText>
      {children}
    </View>
  );
}

// The frame is dark in both appearances, so these are light-on-dark overlays, not theme colours.
const styles = StyleSheet.create({
  guide: {
    width: '65%',
    height: '85%',
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.base,
  },
  title: { color: neutral[0], textAlign: 'center' },
  message: { color: 'rgba(255, 255, 255, 0.75)', textAlign: 'center' },
});
