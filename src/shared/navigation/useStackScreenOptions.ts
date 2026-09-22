import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

import { useTheme } from '@/theme';

/**
 * iOS large-title navigation bar: transparent over the page with a system blur once content
 * scrolls under it (screens use contentInsetAdjustmentBehavior="automatic"). Android has no
 * automatic insets, so it keeps a solid bar.
 */
export function useLargeTitleScreenOptions(): NativeStackNavigationOptions {
  const { colors } = useTheme();

  return {
    headerLargeTitleEnabled: true,
    headerLargeTitleShadowVisible: false,
    headerShadowVisible: false,
    headerTintColor: colors.textBrand,
    headerTitleStyle: { color: colors.textPrimary },
    headerLargeTitleStyle: { color: colors.textPrimary },
    ...(Platform.OS === 'ios'
      ? { headerTransparent: true, headerBlurEffect: 'systemChromeMaterial' }
      : { headerStyle: { backgroundColor: colors.bgPage } }),
  };
}
