import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { parseDiscount, receiptBreakdown } from '@/core/utils/discountUtils';
import { type DraftErrors, type DraftExpense, toLine } from '@/core/utils/expenseDraft';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { ExpenseItemCard } from '@/shared/components/ExpenseItemCard';
import { TextField } from '@/shared/components/TextField';
import { radius, spacing } from '@/theme';

import type { ReceiptPhoto } from '../utils/receiptPhoto';

interface ReviewStepProps {
  photo: ReceiptPhoto | null;
  drafts: DraftExpense[];
  draftErrors: Record<number, DraftErrors>;
  /** "Receipt discount (£)" field text; empty means none. */
  receiptDiscount: string;
  receiptDiscountError: string | null;
  onReceiptDiscountChange: (text: string) => void;
  error: string | null;
  photoUploadFailed: boolean;
  onChange: (key: number, patch: Partial<DraftExpense>) => void;
  onRemove: (key: number) => void;
  onContinue: () => void;
  onRetake: () => void;
}

export function ReviewStep({
  photo,
  drafts,
  draftErrors,
  receiptDiscount,
  receiptDiscountError,
  onReceiptDiscountChange,
  error,
  photoUploadFailed,
  onChange,
  onRemove,
  onContinue,
  onRetake,
}: ReviewStepProps) {
  const count = drafts.length;
  // What will be paid: after item discounts and the receipt discount, live as fields change.
  const { total } = receiptBreakdown(drafts.map(toLine), parseDiscount(receiptDiscount) || 0);
  const hasErrors = Object.keys(draftErrors).length > 0 || receiptDiscountError != null;

  return (
    <>
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Review your receipt
        </AppText>
        <AppText variant="subhead" tone="secondary">
          {`We found ${count} ${count === 1 ? 'expense' : 'expenses'}. Edit anything that's not quite right.`}
        </AppText>
      </View>

      <Card style={styles.summary}>
        {photo && <Image source={{ uri: photo.uri }} style={styles.thumb} contentFit="cover" accessibilityLabel="Receipt photo" />}
        <View style={styles.summaryText}>
          <AppText variant="subhead" weight="600">
            {`${count} ${count === 1 ? 'item' : 'items'}`}
          </AppText>
          <AppText variant="title3" weight="700" numeric>
            {formatMoney(total)}
          </AppText>
        </View>
      </Card>

      {photoUploadFailed && (
        // Non-blocking: the expenses still save, just without the photo.
        <AppText variant="footnote" tone="secondary" accessibilityLiveRegion="polite">
          {"Photo couldn't be uploaded; your expenses will still save."}
        </AppText>
      )}
      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}
      {hasErrors && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          Fix the highlighted fields to continue.
        </AppText>
      )}

      {drafts.map((draft, index) => (
        <ExpenseItemCard
          key={draft.key}
          draft={draft}
          index={index}
          errors={draftErrors[draft.key]}
          canRemove={count > 1}
          onChange={patch => onChange(draft.key, patch)}
          onRemove={() => onRemove(draft.key)}
          showDiscount
        />
      ))}

      {count > 1 && (
        // A one-item receipt keeps its discounts on the item (PL-007).
        <Card style={styles.receiptDiscount}>
          <TextField
            label="Receipt discount (£)"
            value={receiptDiscount}
            onChangeText={onReceiptDiscountChange}
            keyboardType="decimal-pad"
            placeholder="None"
            error={receiptDiscountError ?? undefined}
          />
        </Card>
      )}

      <View style={styles.actions}>
        <Button title="Retake" variant="secondary" onPress={onRetake} style={styles.secondary} />
        <Button title="Continue" onPress={onContinue} style={styles.primary} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  thumb: { width: 52, height: 66, borderRadius: radius.sm },
  summaryText: { flex: 1, gap: spacing['2xs'] },
  receiptDiscount: { padding: spacing.base },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  secondary: { flex: 1 },
  primary: { flex: 2 },
});
