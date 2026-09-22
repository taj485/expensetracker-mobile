import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

/** Grab handle for sheets on web, where the iOS-only sheetGrabberVisible has no effect — like the web app's drawer handle. */
export function SheetHandle() {
  const { colors } = useTheme();
  return <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} accessibilityElementsHidden />;
}

const styles = StyleSheet.create({
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
});
