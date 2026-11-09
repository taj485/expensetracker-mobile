import { StyleSheet, View } from 'react-native';

import type { ReceiptBreakdown } from '@/core/utils/discountUtils';
import { formatDeduction, formatMoney } from '@/core/utils/moneyUtils';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

interface ReceiptBreakdownRowsProps {
  breakdown: ReceiptBreakdown;
}

/**
 * How a discounted receipt's total is worked out: Subtotal, Item discounts, Receipt discount and
 * Total. Renders nothing when there's no discount, so undiscounted receipts look as before.
 */
export function ReceiptBreakdownRows({ breakdown }: ReceiptBreakdownRowsProps) {
  const styles = useThemedStyles(createStyles);
  if (breakdown.itemDiscounts <= 0 && breakdown.receiptDiscount <= 0) return null;

  const rows = [
    { label: 'Subtotal', value: formatMoney(breakdown.subtotal) },
    ...(breakdown.itemDiscounts > 0 ? [{ label: 'Item discounts', value: formatDeduction(breakdown.itemDiscounts) }] : []),
    ...(breakdown.receiptDiscount > 0 ? [{ label: 'Receipt discount', value: formatDeduction(breakdown.receiptDiscount) }] : []),
  ];

  return (
    <View style={styles.list}>
      {rows.map(row => (
        <View key={row.label} accessible accessibilityLabel={`${row.label}: ${row.value}`} style={styles.row}>
          <AppText variant="subhead" tone="secondary">
            {row.label}
          </AppText>
          <AppText variant="subhead" numeric>
            {row.value}
          </AppText>
        </View>
      ))}
      <View accessible accessibilityLabel={`Total: ${formatMoney(breakdown.total)}`} style={[styles.row, styles.totalRow]}>
        <AppText variant="subhead" weight="600">
          Total
        </AppText>
        <AppText variant="subhead" weight="700" numeric>
          {formatMoney(breakdown.total)}
        </AppText>
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    list: { gap: spacing.xs },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.base },
    totalRow: {
      paddingTop: spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderDefault,
    },
  });
