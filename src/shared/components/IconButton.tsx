import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { radius, type Theme, useThemedStyles } from '@/theme';

interface IconButtonProps {
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
  /** Shows the button in its "on" state (e.g. a starred space). */
  selected?: boolean;
}

/** Round, bordered icon button — 40pt visual, 44pt tap target. */
export function IconButton({ accessibilityLabel, onPress, children, disabled = false, selected }: IconButtonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={2}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}>
      {children}
    </Pressable>
  );
}

const createStyles = ({ colors, shadowCard }: Theme) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
      boxShadow: shadowCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    disabled: { opacity: 0.5 },
  });
