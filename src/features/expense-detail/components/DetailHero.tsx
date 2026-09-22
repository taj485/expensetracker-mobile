import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import type { Expense } from '@/core/models/expense.model';
import { expenseTotal } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { CategoryBadge } from '@/shared/components/CategoryBadge';
import { displayTypography, purple, radius, spacing } from '@/theme';

interface DetailHeroProps {
  expense: Expense;
  /** Space above the content for the status bar and the transparent navigation bar. */
  topInset: number;
}

/** Full-bleed purple header: merchant, line total and category. */
export function DetailHero({ expense, topInset }: DetailHeroProps) {
  return (
    <LinearGradient
      colors={[purple[600], purple[800]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, { paddingTop: topInset + spacing.sm }]}>
      <AppText variant="subhead" tone="onBrand" style={styles.merchant} numberOfLines={1}>
        {expense.merchant || 'No merchant'}
      </AppText>
      <AppText tone="onBrand" style={displayTypography.amount} numeric adjustsFontSizeToFit numberOfLines={1}>
        {formatMoney(expenseTotal(expense))}
      </AppText>
      <CategoryBadge category={expense.category} onBrand />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
    gap: spacing.xs,
  },
  merchant: { opacity: 0.85 },
});
