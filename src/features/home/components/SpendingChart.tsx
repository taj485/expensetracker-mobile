import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import type { Expense } from '@/core/models/expense.model';
import { formatDateRange, formatDayLabel, formatMonthKey, formatMonthKeyShort } from '@/core/utils/dateUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { type ChartPeriod, type SpendBucket, spendingBuckets } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { type SegmentedOption, SegmentedControl } from '@/shared/components/SegmentedControl';
import { COMPACT_MAX_FONT_SCALE, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

const PLOT_HEIGHT = 200;
const AXIS_WIDTH = 44;

const PERIODS: SegmentedOption<ChartPeriod>[] = [
  { key: 'week', label: 'W', accessibilityLabel: 'Week' },
  { key: 'month', label: 'M', accessibilityLabel: 'Month' },
  { key: 'half-year', label: '6M', accessibilityLabel: 'Six months' },
  { key: 'year', label: 'Y', accessibilityLabel: 'Year' },
];

const AVERAGE_UNIT: Record<ChartPeriod, string> = {
  week: 'a day',
  month: 'a day',
  'half-year': 'a week',
  year: 'a month',
};

/** Rounds up to 1, 2 or 5 × a power of ten, so the axis tops out on a readable figure. */
function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find(s => value <= s * magnitude)!;
  return step * magnitude;
}

function formatTick(value: number): string {
  return `£${Number.isInteger(value) ? value.toLocaleString('en-GB') : value.toFixed(1)}`;
}

/** What one bar covers: 'Sat 3 Oct', '28 Sep – 4 Oct 2026' or 'October 2026'. */
function bucketDescription(bucket: SpendBucket, period: ChartPeriod): string {
  if (period === 'half-year') return formatDateRange(bucket.start, bucket.end);
  if (period === 'year') return formatMonthKey(bucket.start.slice(0, 7));
  return formatDayLabel(bucket.start);
}

function periodDescription(start: string, end: string, period: ChartPeriod): string {
  if (period === 'year') return `${formatMonthKeyShort(start.slice(0, 7))} – ${formatMonthKeyShort(end.slice(0, 7))}`;
  return formatDateRange(start, end);
}

interface SpendingChartProps {
  expenses: Expense[];
}

/**
 * Spending over the last week, month, six months or year, drawn like the Health app's charts: one
 * bar per day, week or month, with the period's average above. There's no hover on a phone, so
 * tapping a bar shows its total in place of the average; tapping it again goes back.
 */
export function SpendingChart({ expenses }: SpendingChartProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [period, setPeriod] = useState<ChartPeriod>('week');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { buckets, start, end, average } = spendingBuckets(expenses, period);
  const selected = selectedIndex != null ? buckets[selectedIndex] : null;
  const scaleMax = niceCeiling(Math.max(...buckets.map(b => b.total), 0));
  const ticks = [0, scaleMax / 2, scaleMax];
  const yOf = (value: number) => PLOT_HEIGHT - (value / scaleMax) * PLOT_HEIGHT;
  const xOf = (index: number): `${number}%` => `${(index / buckets.length) * 100}%`;
  // Fewer, wider bars get a bigger gap and rounder tops, as in Health.
  const isDense = buckets.length > 12;

  const selectPeriod = (next: ChartPeriod) => {
    setPeriod(next);
    setSelectedIndex(null);
  };

  return (
    <View>
      <SegmentedControl options={PERIODS} selected={period} onSelect={selectPeriod} accessibilityLabel="Chart period" />

      <View style={styles.header} aria-live="polite">
        <AppText variant="footnote" weight="600" tone="secondary" style={styles.overline}>
          {selected ? 'Total' : 'Average'}
        </AppText>
        <View style={styles.valueRow}>
          <AppText variant="largeTitle" numeric>
            {formatMoney(selected ? selected.total : average)}
          </AppText>
          {!selected && (
            <AppText variant="subhead" weight="600" tone="secondary">
              {AVERAGE_UNIT[period]}
            </AppText>
          )}
        </View>
        <AppText variant="subhead" weight="600" tone="secondary">
          {selected ? bucketDescription(selected, period) : periodDescription(start, end, period)}
        </AppText>
      </View>

      <View style={styles.plotRow}>
        <View style={styles.plot}>
          <Svg style={StyleSheet.absoluteFill}>
            {ticks.map(value => (
              <Line
                key={value}
                x1="0"
                x2="100%"
                y1={Math.max(yOf(value), 0.5)}
                y2={Math.max(yOf(value), 0.5)}
                stroke={colors.borderDefault}
                strokeWidth={1}
              />
            ))}
            {/* Dashed divider before each labelled bar, plus one closing off the right edge. */}
            {[...buckets.flatMap((b, i) => (b.label ? [i] : [])), buckets.length].map(i => (
              <Line
                key={i}
                x1={xOf(i)}
                x2={xOf(i)}
                y1="0"
                y2="100%"
                stroke={colors.borderDefault}
                strokeWidth={1}
                strokeDasharray="2,3"
              />
            ))}
          </Svg>

          <View style={styles.bars}>
            {buckets.map((b, i) => {
              const isSelected = i === selectedIndex;
              return (
                // The whole column is the tap target, so thin bars stay easy to hit.
                <Pressable
                  key={b.start}
                  role="button"
                  aria-label={`${bucketDescription(b, period)}, ${formatMoney(b.total)}`}
                  aria-selected={isSelected}
                  onPress={() => setSelectedIndex(isSelected ? null : i)}
                  style={styles.col}>
                  {b.total > 0 && (
                    <View
                      style={[
                        styles.bar,
                        isDense ? styles.barDense : styles.barWide,
                        selectedIndex != null && !isSelected && styles.barDimmed,
                        { height: (b.total / scaleMax) * PLOT_HEIGHT },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.axis}>
          {ticks.map(value => (
            <AppText
              key={value}
              variant="caption2"
              tone="secondary"
              numeric
              style={[styles.tick, { top: yOf(value) - 7 }]}
              maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {formatTick(value)}
            </AppText>
          ))}
        </View>
      </View>

      <View style={styles.labels} importantForAccessibility="no-hide-descendants">
        {buckets.map((b, i) =>
          b.label ? (
            <AppText
              key={b.start}
              variant="caption2"
              tone="secondary"
              numberOfLines={1}
              style={[styles.label, { left: xOf(i) }]}
              maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {b.label}
            </AppText>
          ) : null,
        )}
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    header: { marginTop: spacing.base, marginBottom: spacing.md },
    overline: { textTransform: 'uppercase', letterSpacing: 0.5 },
    valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
    plotRow: { flexDirection: 'row' },
    plot: { flex: 1, height: PLOT_HEIGHT },
    bars: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
    col: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    // Rounded data end, square at the baseline.
    bar: { minHeight: 2, backgroundColor: colors.bgBrand },
    barWide: { width: '64%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    barDense: { width: '60%', borderTopLeftRadius: 2, borderTopRightRadius: 2 },
    barDimmed: { opacity: 0.35 },
    axis: { width: AXIS_WIDTH, height: PLOT_HEIGHT },
    tick: { position: 'absolute', left: spacing.xs },
    labels: { height: 18, marginRight: AXIS_WIDTH, marginTop: spacing.xs },
    label: { position: 'absolute', paddingLeft: 3 },
  });
