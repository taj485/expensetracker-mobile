import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { neutral, radius } from '@/theme';

/** Dark rounded stage for the capture guide and the photo being read. */
export function ReceiptFrame({ children }: { children: ReactNode }) {
  return <View style={styles.frame}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    height: 300,
    borderRadius: radius.xl,
    // Inverse ground in both appearances — photos read best on dark.
    backgroundColor: neutral[900],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
