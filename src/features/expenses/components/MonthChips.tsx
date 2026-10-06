import { ScrollView, StyleSheet } from 'react-native';

import { DATE_PERIODS, type DatePeriod, formatMonthKeyShort } from '@/core/utils/dateUtils';
import { Chip } from '@/shared/components/Chip';
import { spacing } from '@/theme';

interface MonthChipsProps {
  monthKeys: string[];
  /** Selected months; empty means all. */
  selected: string[];
  /** The selected rolling period, or null when filtering by month. */
  period: DatePeriod | null;
  onToggle: (monthKey: string) => void;
  onClear: () => void;
  onSelectPeriod: (period: DatePeriod) => void;
}

const PERIOD_LABELS: Record<DatePeriod, string> = { 'this-week': 'This week', 'last-week': 'Last week', today: 'Today' };

/**
 * Horizontal date filter: the rolling periods, "All months", then newest month first. Pick one
 * period or any number of months; months stay in date order, unlike categories.
 */
export function MonthChips({ monthKeys, selected, period, onToggle, onClear, onSelectPeriod }: MonthChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      // Bleed to the screen edges so chips scroll off-screen rather than clipping at the padding.
      style={styles.bleed}>
      {DATE_PERIODS.map(p => (
        <Chip key={p} label={PERIOD_LABELS[p]} selected={period === p} onPress={() => onSelectPeriod(p)} />
      ))}
      <Chip label="All months" selected={period === null && selected.length === 0} onPress={onClear} />
      {monthKeys.map(key => (
        <Chip key={key} label={formatMonthKeyShort(key)} selected={selected.includes(key)} onPress={() => onToggle(key)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -spacing.lg },
  rail: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
