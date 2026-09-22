import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { DraftErrors, DraftExpense } from '@/core/utils/expenseDraft';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { ExpenseItemCard } from '@/shared/components/ExpenseItemCard';
import { radius, spacing } from '@/theme';

import type { ReceiptPhoto } from '../utils/receiptPhoto';

interface ReviewStepProps {
  photo: ReceiptPhoto | null;
  drafts: DraftExpense[];
  draftErrors: Record<number, DraftErrors>;
  error: string | null;
  onChange: (key: number, patch: Partial<DraftExpense>) => void;
  onRemove: (key: number) => void;
  onContinue: () => void;
  onRetake: () => void;
}

export function ReviewStep({ photo, drafts, draftErrors, error, onChange, onRemove, onContinue, onRetake }: ReviewStepProps) {
  const count = drafts.length;
  const total = drafts.reduce((sum, d) => sum + (Number(d.unitPrice) || 0) * (Number(d.quantity) || 0), 0);
  const hasErrors = Object.keys(draftErrors).length > 0;

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
        />
      ))}

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
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  secondary: { flex: 1 },
  primary: { flex: 2 },
});
