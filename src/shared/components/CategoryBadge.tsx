import { StyleSheet, View } from 'react-native';

import type { ExpenseCategory } from '@/core/models/expense.model';
import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  /** For use on the purple hero, where the category colours would clash. */
  onBrand?: boolean;
}

export function CategoryBadge({ category, onBrand = false }: CategoryBadgeProps) {
  const { colors } = useTheme();
  const palette = colors.category[category];

  return (
    <View style={[styles.badge, { backgroundColor: onBrand ? 'rgba(255, 255, 255, 0.2)' : palette.soft }]}>
      <AppText variant="caption1" weight="600" style={{ color: onBrand ? colors.textOnBrand : palette.ink }}>
        {category}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing['2xs'],
    borderRadius: radius.full,
  },
});
