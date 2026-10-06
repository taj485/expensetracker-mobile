import { ScrollView, StyleSheet } from 'react-native';

import { formatMonthKeyShort } from '@/core/utils/dateUtils';
import { Chip } from '@/shared/components/Chip';
import { spacing } from '@/theme';

interface MonthChipsProps {
  monthKeys: string[];
  selected: string | null;
  today: boolean;
  onSelect: (monthKey: string | null) => void;
  onToggleToday: () => void;
}

/** Horizontal date filter: "Today", "All months", then newest month first. */
export function MonthChips({ monthKeys, selected, today, onSelect, onToggleToday }: MonthChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      // Bleed to the screen edges so chips scroll off-screen rather than clipping at the padding.
      style={styles.bleed}>
      <Chip label="Today" selected={today} onPress={onToggleToday} />
      <Chip label="All months" selected={!today && selected === null} onPress={() => onSelect(null)} />
      {monthKeys.map(key => (
        <Chip key={key} label={formatMonthKeyShort(key)} selected={!today && selected === key} onPress={() => onSelect(key)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -spacing.lg },
  rail: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
