import { StyleSheet, View } from 'react-native';

import { categoryEmoji } from '@/core/utils/categoryUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import type { CategorySpend } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { radius, spacing, useTheme } from '@/theme';

interface CategoryRowProps {
  spend: CategorySpend;
}

export function CategoryRow({ spend }: CategoryRowProps) {
  const { colors } = useTheme();
  const palette = colors.category[spend.category];
  const itemLabel = `${spend.count} ${spend.count === 1 ? 'item' : 'items'}`;

  return (
    <Card style={styles.row}>
      <View
        style={[styles.icon, { backgroundColor: palette.soft }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
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
    </Card>
  );
}

const styles = StyleSheet.create({
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
