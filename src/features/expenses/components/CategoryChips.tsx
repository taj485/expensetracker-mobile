import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES, categoryEmoji } from '@/core/utils/categoryUtils';
import { AppText } from '@/shared/components/AppText';
import { Chip } from '@/shared/components/Chip';
import { COMPACT_MAX_FONT_SCALE, radius, spacing, useTheme } from '@/theme';

interface CategoryChipsProps {
  /** Selected categories, most recently selected first. */
  selected: ExpenseCategory[];
  onToggle: (category: ExpenseCategory) => void;
  onClear: () => void;
}

/**
 * Multi-select category filter: "All categories", then the selected pills (latest first), then
 * the rest in their usual order.
 */
export function CategoryChips({ selected, onToggle, onClear }: CategoryChipsProps) {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const ordered = [...selected, ...ALL_CATEGORIES.filter(category => !selected.includes(category))];

  // The tapped pill moves to the front, which may be off-screen — bring the row back to the start.
  const scrollToStart = () => scrollRef.current?.scrollTo({ x: 0, animated: true });

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      // Bleed to the screen edges so chips scroll off-screen rather than clipping at the padding.
      style={styles.bleed}
      accessibilityLabel="Filter by category">
      <Chip
        label="All categories"
        selected={selected.length === 0}
        onPress={() => {
          onClear();
          scrollToStart();
        }}
      />
      {ordered.map(category => {
        const isOn = selected.includes(category);
        const palette = colors.category[category];
        return (
          <Pressable
            key={category}
            // role/aria-checked (not accessibilityState) so the checked state also reaches web screen readers.
            role="checkbox"
            aria-checked={isOn}
            aria-label={category}
            onPress={() => {
              onToggle(category);
              scrollToStart();
            }}
            style={({ pressed }) => [
              styles.chip,
              { borderColor: isOn ? palette.ink : colors.borderDefault, backgroundColor: isOn ? palette.soft : colors.bgSurface },
              pressed && styles.pressed,
            ]}>
            <AppText
              variant="footnote"
              weight={isOn ? '600' : '500'}
              style={{ color: isOn ? palette.ink : colors.textSecondary }}
              maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {`${categoryEmoji(category)} ${category}`}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -spacing.lg },
  rail: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  pressed: { opacity: 0.75 },
});
