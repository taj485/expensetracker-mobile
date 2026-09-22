import type { ComponentType } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import type { IconProps } from '@/shared/icons/AppIcons';
import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

interface SidebarNavItemProps {
  label: string;
  Icon: ComponentType<IconProps>;
  onPress: () => void;
  destructive?: boolean;
}

/** Plain navigation row in the sidebar (Dashboard, Profile, Log out). */
export function SidebarNavItem({ label, Icon, onPress, destructive = false }: SidebarNavItemProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const color = destructive ? colors.textNegative : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Icon color={color} />
      <AppText variant="subhead" weight="500" style={{ color }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 44,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
    },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
  });
