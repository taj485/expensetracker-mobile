import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radius, type Theme, useThemedStyles } from '@/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

/** Bordered surface with the card shadow (light mode) — the base of rows, tiles and receipts. */
export function Card({ children, style }: CardProps) {
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = ({ colors, shadowCard }: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.bgSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderDefault,
      borderRadius: radius.lg,
      boxShadow: shadowCard,
      overflow: 'hidden',
    },
  });
