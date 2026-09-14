import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import type { IconProps } from '@/shared/icons/AppIcons';
import { radius, spacing } from '@/theme';

interface FeatureRowProps {
  Icon: ComponentType<IconProps>;
  text: string;
}

/** Frosted row on the purple welcome ground. */
export function FeatureRow({ Icon, text }: FeatureRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Icon color="#FFFFFF" size={17} />
      </View>
      <AppText variant="footnote" tone="onBrand" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});
