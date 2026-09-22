import type { ComponentType } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { IconProps } from '@/shared/icons/AppIcons';
import { COMPACT_MAX_FONT_SCALE, radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

import { AppText } from '../AppText';

interface TabBarItemProps {
  label: string;
  Icon: ComponentType<IconProps>;
  active?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export function TabBarItem({ label, Icon, active = false, onPress, onLongPress }: TabBarItemProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const color = active ? colors.textBrand : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.item, active && styles.active]}>
      <Icon color={color} />
      <AppText
        variant="caption2"
        weight={active ? '600' : '500'}
        style={{ color }}
        numberOfLines={1}
        maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
      minWidth: 60,
    },
    active: { backgroundColor: colors.bgBrandSoft },
  });
