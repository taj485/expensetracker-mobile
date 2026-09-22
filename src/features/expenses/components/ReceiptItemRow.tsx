import { Pressable, StyleSheet, View } from 'react-native';

import type { Expense } from '@/core/models/expense.model';
import { expenseTotal } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { CategoryBadge } from '@/shared/components/CategoryBadge';
import { spacing, type Theme, useThemedStyles } from '@/theme';

interface ReceiptItemRowProps {
  expense: Expense;
  isLast: boolean;
  onPress: () => void;
}

export function ReceiptItemRow({ expense, isLast, onPress }: ReceiptItemRowProps) {
  const styles = useThemedStyles(createStyles);
  const total = formatMoney(expenseTotal(expense));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${expense.description}, ${expense.category}, ${total}`}
      accessibilityHint="Opens expense details"
      onPress={onPress}
      style={({ pressed }) => [styles.row, !isLast && styles.divider, pressed && styles.pressed]}>
      <View style={styles.info}>
        <AppText variant="subhead">{expense.description}</AppText>
        <CategoryBadge category={expense.category} />
      </View>

      <View style={styles.figures}>
        <AppText variant="subhead" weight="600" numeric>
          {total}
        </AppText>
        <AppText variant="caption1" tone="secondary" numeric>
          {expense.quantity} × {formatMoney(expense.unitPrice)}
        </AppText>
      </View>
    </Pressable>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderDefault },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    info: { flex: 1, gap: 6 },
    figures: { alignItems: 'flex-end', gap: spacing['2xs'] },
  });
