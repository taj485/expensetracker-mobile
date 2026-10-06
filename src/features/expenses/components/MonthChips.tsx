import { ScrollView, StyleSheet } from 'react-native';

import { formatMonthKeyShort } from '@/core/utils/dateUtils';
import { Chip } from '@/shared/components/Chip';
import { spacing } from '@/theme';

interface MonthChipsProps {
  monthKeys: string[];
  /** Selected months; empty means all. */
  selected: string[];
  today: boolean;
  onToggle: (monthKey: string) => void;
  onClear: () => void;
  onToggleToday: () => void;
}

/**
 * Horizontal date filter: "Today", "All months", then newest month first. Months are multi-select
 * but, unlike categories, stay in date order.
 */
export function MonthChips({ monthKeys, selected, today, onToggle, onClear, onToggleToday }: MonthChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      // Bleed to the screen edges so chips scroll off-screen rather than clipping at the padding.
      style={styles.bleed}>
      <Chip label="Today" selected={today} onPress={onToggleToday} />
      <Chip label="All months" selected={!today && selected.length === 0} onPress={onClear} />
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
