import { Pressable, StyleSheet, View } from 'react-native';

import type { ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES, categoryEmoji } from '@/core/utils/categoryUtils';
import { COMPACT_MAX_FONT_SCALE, radius, spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

interface CategoryPickerProps {
  value: ExpenseCategory;
  onChange: (category: ExpenseCategory) => void;
}

/** Wrapping row of category chips (mockup's "Add expense" sheet). */
export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap} accessibilityRole="radiogroup" accessibilityLabel="Category">
      {ALL_CATEGORIES.map(category => {
        const selected = category === value;
        return (
          <Pressable
            key={category}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={category}
            onPress={() => onChange(category)}
            style={[styles.option, selected && styles.selected]}>
            <AppText
              variant="footnote"
              weight={selected ? '600' : '500'}
              tone={selected ? 'brand' : 'primary'}
              maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {categoryEmoji(category)} {category}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    option: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
    },
    selected: { borderColor: colors.bgBrand, backgroundColor: colors.bgBrandSoft },
  });
