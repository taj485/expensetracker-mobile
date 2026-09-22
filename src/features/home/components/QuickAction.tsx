import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import type { IconProps } from '@/shared/icons/AppIcons';
import { COMPACT_MAX_FONT_SCALE, radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

interface QuickActionProps {
  label: string;
  Icon: ComponentType<IconProps>;
  onPress: () => void;
}

export function QuickAction({ label, Icon, onPress }: QuickActionProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <View style={styles.iconBox}>
        <Icon color={colors.iconBrand} size={19} />
      </View>
      <AppText variant="caption1" weight="600" maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = ({ colors, shadowCard }: Theme) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
      boxShadow: shadowCard,
    },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: radius.md,
      backgroundColor: colors.bgBrandSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
