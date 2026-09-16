import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSpacesSidebar } from '@/features/spaces/SpacesSidebarProvider';
import { AddIcon, ExpensesIcon, HomeIcon, type IconProps, SpacesIcon } from '@/shared/icons/AppIcons';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { ScanTabButton } from './ScanTabButton';
import { TabBarItem } from './TabBarItem';

// Route names of the tab folders in src/app/(app)/(tabs). Home is a group so it lives at "/".
// Profile is still a tab route, but it's reached from the spaces sidebar rather than the bar.
type TabRouteName = '(home)' | 'expenses';

const TABS: Record<TabRouteName, { label: string; Icon: ComponentType<IconProps> }> = {
  '(home)': { label: 'Home', Icon: HomeIcon },
  expenses: { label: 'Expenses', Icon: ExpensesIcon },
};

/**
 * Custom tab bar from the Recave mockup: Home · Expenses · [Scan] · Add · Spaces.
 * Scan and Add open sheets and Spaces opens the space-switcher sidebar; the others switch tabs.
 */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const spacesSidebar = useSpacesSidebar();

  const renderTab = (name: TabRouteName) => {
    const index = state.routes.findIndex(route => route.name === name);
    const route = state.routes[index];
    if (!route) return null;
    const isFocused = state.index === index;

    return (
      <TabBarItem
        key={route.key}
        label={TABS[name].label}
        Icon={TABS[name].Icon}
        active={isFocused}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
      />
    );
  };

  return (
    <View accessibilityRole="tablist" style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {renderTab('(home)')}
      {renderTab('expenses')}
      <ScanTabButton onPress={() => router.push('/scan')} />
      <TabBarItem label="Add" Icon={AddIcon} onPress={() => router.push('/add-expense')} />
      <TabBarItem label="Spaces" Icon={SpacesIcon} onPress={spacesSidebar.open} />
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      // flex-end puts every label on one baseline while the Scan button overhangs upward.
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.bgSurface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderDefault,
    },
  });
