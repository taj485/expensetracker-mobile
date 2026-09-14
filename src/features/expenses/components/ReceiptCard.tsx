import { StyleSheet, View } from 'react-native';

import { formatShortDate } from '@/core/utils/dateUtils';
import type { ReceiptGroup } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { MerchantLogo } from '@/shared/components/MerchantLogo';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { ReceiptItemRow } from './ReceiptItemRow';

interface ReceiptCardProps {
  receipt: ReceiptGroup;
  onPressExpense: (expenseId: number) => void;
}

/** One card per receipt: merchant header with the receipt total, over its line items. */
export function ReceiptCard({ receipt, onPressExpense }: ReceiptCardProps) {
  const styles = useThemedStyles(createStyles);
  const merchant = receipt.merchant || 'Uncategorised';

  return (
    <Card>
      <View style={styles.head} accessible accessibilityLabel={`${merchant}, ${formatShortDate(receipt.date)}, total ${formatMoney(receipt.total)}`}>
        <MerchantLogo merchant={receipt.merchant} website={receipt.merchantWebsite} />
        <View style={styles.ident}>
          <AppText variant="subhead" weight="600" numberOfLines={1}>
            {merchant}
          </AppText>
          <AppText variant="caption1" tone="secondary">
            {formatShortDate(receipt.date)}
          </AppText>
        </View>
        <AppText variant="headline" weight="700" numeric>
          {formatMoney(receipt.total)}
        </AppText>
      </View>

      <View style={styles.items}>
        {receipt.expenses.map((expense, index) => (
          <ReceiptItemRow
            key={expense.id}
            expense={expense}
            isLast={index === receipt.expenses.length - 1}
            onPress={() => onPressExpense(expense.id)}
          />
        ))}
      </View>
    </Card>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
    },
    ident: { flex: 1, gap: spacing['2xs'] },
    items: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderDefault },
  });
