import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatMonthKeyShort } from '@/core/utils/dateUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import type { MonthSummary } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { displayTypography, purple, radius, spacing, useTheme } from '@/theme';

interface BalanceCardProps {
  monthKey: string;
  summary: MonthSummary;
  /** Opens Expenses filtered to this month. */
  onPress: () => void;
}

function changeLabel(change: number | null): string | null {
  if (change == null) return null;
  const arrow = change >= 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(Math.round(change))}% vs last month`;
}

/** Hero card: this month's spend for the selected space, with a three-way split. */
export function BalanceCard({ monthKey, summary, onPress }: BalanceCardProps) {
  const { shadowBrand } = useTheme();
  const change = changeLabel(summary.changeVsPreviousMonth);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Spent this month, ${formatMoney(summary.total)}${change ? `, ${change}` : ''}`}
      accessibilityHint="Shows this month's expenses"
      onPress={onPress}
      style={({ pressed }) => [styles.shadow, { boxShadow: shadowBrand }, pressed && styles.pressed]}>
      <LinearGradient colors={[purple[600], purple[800]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.head}>
          <AppText variant="footnote" tone="onBrand" style={styles.soft}>
            Spent this month
          </AppText>
          <View style={styles.monthChip}>
            <AppText variant="caption1" weight="600" tone="onBrand" maxFontSizeMultiplier={1.4}>
              {formatMonthKeyShort(monthKey)}
            </AppText>
          </View>
        </View>

        <AppText tone="onBrand" style={displayTypography.amount} numeric adjustsFontSizeToFit numberOfLines={1}>
          {formatMoney(summary.total)}
        </AppText>
        {change && (
          <AppText variant="footnote" tone="onBrand" style={styles.soft}>
            {change}
          </AppText>
        )}

        <View style={styles.split}>
          {/* "Entries" (as on the Expenses stats) — "Transactions" truncates in a three-way split on a 375pt phone. */}
          <SplitItem label="Entries" value={String(summary.transactions)} />
          <SplitItem label="Top spend" value={summary.topCategory ?? '—'} />
          <SplitItem label="Daily avg" value={formatMoney(summary.dailyAverage)} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function SplitItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.splitItem}>
      <AppText variant="caption2" weight="600" tone="onBrand" style={styles.splitLabel} numberOfLines={1}>
        {label}
      </AppText>
      <AppText variant="headline" weight="700" tone="onBrand" numeric numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { borderRadius: radius['2xl'] },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  card: { borderRadius: radius['2xl'], padding: spacing.xl, overflow: 'hidden', gap: spacing.xs },
  glow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  soft: { opacity: 0.85 },
  monthChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  split: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  splitItem: { flex: 1, gap: spacing['2xs'] },
  splitLabel: { textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.75 },
});
