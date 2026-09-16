import { Pressable, StyleSheet, View } from 'react-native';

import { categoryEmoji } from '@/core/utils/categoryUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import type { CategorySpend } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { radius, spacing, useTheme } from '@/theme';

interface CategoryRowProps {
  spend: CategorySpend;
  /** Opens Expenses filtered to this month and category. */
  onPress: () => void;
}

export function CategoryRow({ spend, onPress }: CategoryRowProps) {
  const { colors } = useTheme();
  const palette = colors.category[spend.category];
  const itemLabel = `${spend.count} ${spend.count === 1 ? 'item' : 'items'}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${spend.category}, ${formatMoney(spend.total)}, ${itemLabel}`}
      accessibilityHint={`Shows this month's ${spend.category} expenses`}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.row}>
        <View style={[styles.icon, { backgroundColor: palette.soft }]}>
          <AppText variant="title3" maxFontSizeMultiplier={1}>
            {categoryEmoji(spend.category)}
          </AppText>
        </View>

        <View style={styles.info}>
          <AppText variant="subhead" weight="600">
            {spend.category}
          </AppText>
          <View style={[styles.track, { backgroundColor: colors.bgSurfaceAlt }]}>
            <View style={[styles.fill, { width: `${Math.max(spend.shareOfLargest * 100, 4)}%`, backgroundColor: palette.ink }]} />
          </View>
        </View>

        <View style={styles.figures}>
          <AppText variant="subhead" weight="700" numeric>
            {formatMoney(spend.total)}
          </AppText>
          <AppText variant="caption2" tone="secondary">
            {itemLabel}
          </AppText>
        </View>

        <AppText variant="headline" tone="muted" maxFontSizeMultiplier={1.2}>
          ›
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  icon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 6 },
  track: { height: 6, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full },
  figures: { alignItems: 'flex-end', gap: spacing['2xs'] },
});
