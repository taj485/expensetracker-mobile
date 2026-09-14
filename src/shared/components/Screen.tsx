import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

// Native tabs already inset content above the tab bar (a bottom SafeAreaView on Android,
// automatic ScrollView insets on iOS), so tab screens must skip the bottom edge or the
// inset is applied twice. Screens outside the tabs (e.g. login) pass `FULL_SCREEN_EDGES`.
const TAB_SCREEN_EDGES: Edge[] = ['top', 'left', 'right'];
export const FULL_SCREEN_EDGES: Edge[] = ['top', 'left', 'right', 'bottom'];

interface ScreenProps {
  children: ReactNode;
  centered?: boolean;
  edges?: Edge[];
}

export function Screen({ children, centered = false, edges = TAB_SCREEN_EDGES }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <View style={[styles.content, centered && styles.centered]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
