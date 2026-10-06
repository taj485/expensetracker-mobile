import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatDayLabel } from '@/core/utils/dateUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import type { DailySpend } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { COMPACT_MAX_FONT_SCALE, spacing, type Theme, useThemedStyles } from '@/theme';

const PLOT_HEIGHT = 140;
const GUTTER = 40;

/** Rounds up to 1, 2 or 5 × a power of ten, so the axis tops out on a readable figure. */
function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find(s => value <= s * magnitude)!;
  return step * magnitude;
}

function formatTick(value: number): string {
  return `£${Number.isInteger(value) ? value : value.toFixed(1)}`;
}

interface DailySpendChartProps {
  days: DailySpend[];
}

/**
 * One bar per day of the month, in a single brand colour (one series, so no legend). There's no
 * hover on a phone, so tapping a bar selects it and the readout above shows that day; it starts
 * on the highest day.
 */
export function DailySpendChart({ days }: DailySpendChartProps) {
  const styles = useThemedStyles(createStyles);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const scaleMax = niceCeiling(Math.max(...days.map(d => d.total), 0));
  const peak = days.reduce((best, d) => (d.total > best.total ? d : best), days[0]);
  const selected = days.find(d => d.date === selectedDate && d.total > 0) ?? peak;

  return (
    <View>
      <View style={styles.readout}>
        <AppText variant="headline" weight="700">
          {formatMoney(selected.total)}
        </AppText>
        <AppText variant="footnote" tone="secondary">
          {formatDayLabel(selected.date)}
          {selected === peak ? ' · highest day' : ''}
        </AppText>
      </View>

      <View style={styles.plot}>
        {[0, scaleMax / 2, scaleMax].map(value => (
          <View key={value} style={[styles.gridline, { bottom: (value / scaleMax) * PLOT_HEIGHT }]} pointerEvents="none">
            <AppText variant="caption2" tone="muted" style={styles.tick} maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {formatTick(value)}
            </AppText>
          </View>
        ))}

        <View style={styles.bars}>
          {days.map(d => {
            const hasSpend = d.total > 0;
            const isSelected = d.date === selected.date;
            return (
              // The whole column is the tap target, so thin bars stay easy to hit.
              <Pressable
                key={d.date}
                disabled={!hasSpend}
                accessible={hasSpend}
                role="button"
                aria-label={`${formatDayLabel(d.date)}, ${formatMoney(d.total)}`}
                aria-selected={isSelected}
                onPress={() => setSelectedDate(d.date)}
                style={styles.col}>
                {hasSpend && (
                  <View
                    style={[styles.bar, isSelected && styles.barSelected, { height: (d.total / scaleMax) * PLOT_HEIGHT }]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.axis}>
        {days.map(d => (
          <AppText
            key={d.date}
            variant="caption2"
            tone="muted"
            style={styles.axisLabel}
            numberOfLines={1}
            maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
            {/* The 1st and every 5th day, so 31 labels never crowd. */}
            {d.day === 1 || d.day % 5 === 0 ? d.day : ''}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    readout: { marginBottom: spacing.md },
    plot: { height: PLOT_HEIGHT, marginLeft: GUTTER },
    gridline: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderDefault,
    },
    tick: { position: 'absolute', right: '100%', marginRight: spacing.sm, top: -7 },
    bars: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row', gap: 2 },
    col: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    // Thin bar with a 4px rounded data end, square at the baseline.
    bar: {
      width: '100%',
      maxWidth: 24,
      minHeight: 2,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      backgroundColor: colors.bgBrand,
    },
    barSelected: { backgroundColor: colors.bgBrandPressed },
    axis: { flexDirection: 'row', gap: 2, marginLeft: GUTTER, marginTop: spacing.xs },
    axisLabel: { flex: 1, textAlign: 'center' },
  });
