import { Pressable, StyleSheet, View } from 'react-native';

import type { DraftErrors, DraftExpense } from '@/core/utils/expenseDraft';
import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Card } from './Card';
import { CategoryPicker } from './CategoryPicker';
import { DateField } from './DateField';
import { TextField } from './TextField';

interface ExpenseItemCardProps {
  draft: DraftExpense;
  index: number;
  errors: DraftErrors | undefined;
  canRemove: boolean;
  onChange: (patch: Partial<DraftExpense>) => void;
  onRemove: () => void;
  /** Hide when the merchant is edited once for the whole receipt. */
  showMerchant?: boolean;
  /** Hide when the date can't be changed (the API doesn't update dates on existing expenses). */
  showDate?: boolean;
}

/** One editable line item — used when reviewing a scanned receipt and when editing a saved one. */
export function ExpenseItemCard({
  draft,
  index,
  errors,
  canRemove,
  onChange,
  onRemove,
  showMerchant = true,
  showDate = true,
}: ExpenseItemCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="footnote" weight="600" tone="secondary" style={styles.label}>
          Item {index + 1}
        </AppText>
        {canRemove && (
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove item ${index + 1}`} onPress={onRemove} hitSlop={spacing.sm}>
            <AppText variant="subhead" weight="600" tone="negative">
              Remove
            </AppText>
          </Pressable>
        )}
      </View>

      <TextField label="Description" value={draft.description} onChangeText={description => onChange({ description })} error={errors?.description} />

      <View style={styles.row}>
        <View style={styles.price}>
          <TextField
            label="Unit price (£)"
            value={draft.unitPrice}
            onChangeText={unitPrice => onChange({ unitPrice })}
            keyboardType="decimal-pad"
            error={errors?.unitPrice}
          />
        </View>
        <View style={styles.quantity}>
          <TextField
            label="Qty"
            value={draft.quantity}
            onChangeText={quantity => onChange({ quantity })}
            keyboardType="number-pad"
            error={errors?.quantity}
          />
        </View>
      </View>

      <View style={styles.categoryField}>
        <AppText variant="footnote" weight="600" tone="secondary">
          Category
        </AppText>
        <CategoryPicker value={draft.category} onChange={category => onChange({ category })} />
      </View>

      {showMerchant && (
        <TextField label="Merchant" value={draft.merchant} onChangeText={merchant => onChange({ merchant })} placeholder="Optional" />
      )}

      {showDate && <DateField value={draft.date} onChange={date => onChange({ date })} error={errors?.date} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.base, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  price: { flexGrow: 2, flexBasis: 140 },
  quantity: { flexGrow: 1, flexBasis: 80 },
  categoryField: { gap: 6 },
});
