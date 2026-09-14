import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { type ColorTokens, darkColors, lightColors } from './colors';

export interface Theme {
  isDark: boolean;
  colors: ColorTokens;
  /** Card shadow — light mode only; dark mode uses lighter surfaces for elevation. */
  shadowCard: string | undefined;
  /** Glow under brand-filled elements (scan button, balance card). */
  shadowBrand: string | undefined;
}

const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  shadowCard: '0 1px 3px rgba(23, 21, 38, 0.05), 0 1px 2px rgba(23, 21, 38, 0.04)',
  shadowBrand: '0 8px 20px -4px rgba(108, 58, 224, 0.28)',
};

const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  shadowCard: undefined,
  shadowBrand: '0 8px 20px -4px rgba(124, 77, 234, 0.35)',
};

/** Follows the system appearance setting. */
export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}

/**
 * Builds a component's styles from the current theme, rebuilt only when the appearance changes.
 *
 * const styles = useThemedStyles(createStyles);
 * const createStyles = (theme: Theme) => StyleSheet.create({ ... });
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
