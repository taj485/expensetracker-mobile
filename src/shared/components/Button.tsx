import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'onBrand' | 'ghostOnBrand';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }: ButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;
  const labelColor = labelColorFor(variant, theme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <AppText variant="headline" style={{ color: labelColor, textAlign: 'center' }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

function labelColorFor(variant: ButtonVariant, { colors }: Theme): string {
  switch (variant) {
    case 'primary':
    case 'danger':
    case 'ghostOnBrand':
      return colors.textOnBrand;
    case 'secondary':
      return colors.textPrimary;
    case 'onBrand':
      return colors.textBrand;
  }
}

const createStyles = ({ colors, shadowBrand }: Theme) =>
  StyleSheet.create({
    base: {
      // minHeight (not height) so the label can grow with Dynamic Type.
      minHeight: 50,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: { backgroundColor: colors.bgBrand, boxShadow: shadowBrand },
    primaryPressed: { backgroundColor: colors.bgBrandPressed },
    secondary: { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault },
    secondaryPressed: { backgroundColor: colors.bgSurfaceAlt },
    danger: { backgroundColor: colors.textNegative },
    dangerPressed: { opacity: 0.85 },
    // Inverted for purple grounds — a purple button on purple has no edge.
    onBrand: { backgroundColor: '#FFFFFF' },
    onBrandPressed: { opacity: 0.9 },
    ghostOnBrand: { backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.4)' },
    ghostOnBrandPressed: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    disabled: { opacity: 0.5 },
  });
