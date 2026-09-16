import { StyleSheet, View } from 'react-native';

import type { DraftErrors, DraftExpense } from '@/core/utils/expenseDraft';
import { expenseTotal } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { CategoryPicker } from '@/shared/components/CategoryPicker';
import { DateField } from '@/shared/components/DateField';
import { TextField } from '@/shared/components/TextField';
import { spacing } from '@/theme';

import { AmountField } from './AmountField';

interface ExpenseFormStepProps {
  draft: DraftExpense;
  errors: DraftErrors;
  onChange: (patch: Partial<DraftExpense>) => void;
  onCancel: () => void;
  onContinue: () => void;
}

/** Add expense form, laid out as in the mockup's bottom sheet. */
export function ExpenseFormStep({ draft, errors, onChange, onCancel, onContinue }: ExpenseFormStepProps) {
  const price = Number(draft.unitPrice);
  const quantity = Number(draft.quantity);
  const showTotal = price > 0 && Number.isInteger(quantity) && quantity > 1;

  return (
    <>
      <AppText variant="title3" weight="700" accessibilityRole="header">
        Add expense
      </AppText>

      <AmountField value={draft.unitPrice} onChange={unitPrice => onChange({ unitPrice })} error={errors.unitPrice} />

      <TextField
        label="Merchant (optional)"
        value={draft.merchant}
        onChangeText={merchant => onChange({ merchant })}
        placeholder="Where did you spend?"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <TextField
        label="Description"
        value={draft.description}
        onChangeText={description => onChange({ description })}
        placeholder="What did you spend on?"
        autoCapitalize="sentences"
        error={errors.description}
      />

      <View style={styles.row}>
        <View style={styles.date}>
          <DateField value={draft.date} onChange={date => onChange({ date })} error={errors.date} />
        </View>
        <View style={styles.quantity}>
          <TextField
            label="Quantity"
            value={draft.quantity}
            onChangeText={text => onChange({ quantity: text.replace(/[^0-9]/g, '') })}
            keyboardType="number-pad"
            maxLength={4}
            error={errors.quantity}
          />
        </View>
      </View>

      {showTotal && (
        <AppText variant="subhead" tone="secondary" numeric>
          {`${quantity} × ${formatMoney(price)} = `}
          <AppText variant="subhead" weight="700" numeric>
            {formatMoney(expenseTotal({ unitPrice: price, quantity }))}
          </AppText>
        </AppText>
      )}

      <View style={styles.categoryField}>
        <AppText variant="footnote" weight="600" tone="secondary">
          Category
        </AppText>
        <CategoryPicker value={draft.category} onChange={category => onChange({ category })} />
      </View>

      <View style={styles.actions}>
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={styles.action} />
        <Button title="Continue" onPress={onContinue} style={styles.action} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
  // Wraps to a column at large Dynamic Type sizes instead of squeezing the fields.
  date: { flexGrow: 2, flexBasis: 190 },
  quantity: { flexGrow: 1, flexBasis: 90 },
  categoryField: { gap: 6 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  action: { flex: 1 },
});
