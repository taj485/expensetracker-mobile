import { ScrollView, StyleSheet } from 'react-native';

import { formatMonthKeyShort } from '@/core/utils/dateUtils';
import { Chip } from '@/shared/components/Chip';
import { spacing } from '@/theme';

interface MonthChipsProps {
  monthKeys: string[];
  /** Selected months; empty means all. */
  selected: string[];
  onToggle: (monthKey: string) => void;
  onClear: () => void;
}

/**
 * Horizontal date filter: "All months", then newest month first. Pick any number of months;
 * months stay in date order, unlike categories.
 */
export function MonthChips({ monthKeys, selected, onToggle, onClear }: MonthChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      // Bleed to the screen edges so chips scroll off-screen rather than clipping at the padding.
      style={styles.bleed}>
      <Chip label="All months" selected={selected.length === 0} onPress={onClear} />
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
