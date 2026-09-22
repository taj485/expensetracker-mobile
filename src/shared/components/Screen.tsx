import type { ReactNode } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CLEARANCE } from '@/shared/components/tab-bar/constants';
import { spacing, useTheme } from '@/theme';

interface ScrollScreenProps {
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Screens shown under the custom tab bar need space so the last row isn't hidden. */
  underTabBar?: boolean;
  /** Screen has no navigation bar (e.g. Home), so it must clear the status bar itself. */
  headerless?: boolean;
}

/**
 * Scrolling content for a screen inside a native Stack header. `automatic` insets let the
 * large title collapse as you scroll and keep content clear of the header and status bar.
 */
export function ScrollScreen({
  children,
  onRefresh,
  refreshing = false,
  underTabBar = true,
  headerless = false,
}: ScrollScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  // iOS applies the top safe area through automatic content insets; Android has no equivalent.
  const statusBarPadding = headerless && Platform.OS === 'android' ? insets.top : 0;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.bgPage }}
      contentContainerStyle={[
        styles.content,
        statusBarPadding > 0 && { paddingTop: statusBarPadding + spacing.sm },
        underTabBar && { paddingBottom: TAB_BAR_CLEARANCE },
      ]}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.iconBrand} /> : undefined
      }>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
});
