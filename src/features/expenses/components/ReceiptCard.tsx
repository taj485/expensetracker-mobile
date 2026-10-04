import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { formatShortDate } from '@/core/utils/dateUtils';
import type { ReceiptGroup } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { uploaderLabel } from '@/core/utils/uploaderUtils';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { Collapsible, useOpenProgress } from '@/shared/components/Collapsible';
import { MerchantLogo } from '@/shared/components/MerchantLogo';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { ReceiptItemRow } from './ReceiptItemRow';

interface ReceiptCardProps {
  receipt: ReceiptGroup;
  /** Shared spaces show who added each receipt; in a personal space it would always be "you". */
  showUploader: boolean;
  onPressExpense: (expenseId: number) => void;
}

/** One card per receipt: merchant header with the receipt total, over its line items. Tapping the header folds the items away. */
export function ReceiptCard({ receipt, showUploader, onPressExpense }: ReceiptCardProps) {
  const styles = useThemedStyles(createStyles);
  const [expanded, setExpanded] = useState(true);
  const progress = useOpenProgress(expanded);
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.get() * 90}deg` }] }));
  const merchant = receipt.merchant || 'Uncategorised';
  const uploader = showUploader ? uploaderLabel(receipt, 'short') : null;
  const date = formatShortDate(receipt.date);

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${merchant}, ${date}${uploader ? `, added by ${uploader}` : ''}, total ${formatMoney(receipt.total)}`}
        accessibilityHint={expanded ? 'Hides the items' : 'Shows the items'}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(e => !e)}
        style={({ pressed }) => [styles.head, pressed && styles.pressed]}>
        <MerchantLogo merchant={receipt.merchant} website={receipt.merchantWebsite} />
        <View style={styles.ident}>
          <AppText variant="subhead" weight="600" numberOfLines={1}>
            {merchant}
          </AppText>
          <AppText variant="caption1" tone="secondary" numberOfLines={1}>
            {date}
            {uploader && (
              <>
                {' · Added by '}
                <AppText variant="caption1" weight="600" tone={receipt.createdByCurrentUser ? 'brand' : 'secondary'}>
                  {uploader}
                </AppText>
              </>
            )}
          </AppText>
        </View>
        <AppText variant="headline" weight="700" numeric>
          {formatMoney(receipt.total)}
        </AppText>
        <Animated.View style={chevronStyle} importantForAccessibility="no">
          <AppText variant="headline" tone="muted">
            ›
          </AppText>
        </Animated.View>
      </Pressable>

      <Collapsible expanded={expanded}>
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
      </Collapsible>
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
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    ident: { flex: 1, gap: spacing['2xs'] },
    items: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderDefault },
  });
