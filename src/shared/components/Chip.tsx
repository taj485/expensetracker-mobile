import { Pressable, StyleSheet } from 'react-native';

import { COMPACT_MAX_FONT_SCALE, radius, spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && !selected && styles.pressed]}>
      <AppText
        variant="footnote"
        weight={selected ? '600' : '500'}
        tone={selected ? 'onBrand' : 'secondary'}
        maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: spacing.md + 2,
      paddingVertical: spacing.sm - 1,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
    },
    selected: { backgroundColor: colors.bgBrand, borderColor: colors.bgBrand },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
  });
