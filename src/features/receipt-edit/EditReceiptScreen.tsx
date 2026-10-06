import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Expense } from '@/core/models/expense.model';
import { useSpaceExpenses } from '@/core/queries/expenseQueries';
import { formatMediumDate } from '@/core/utils/dateUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { ExpenseItemCard } from '@/shared/components/ExpenseItemCard';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/QueryState';
import { TAB_BAR_CLEARANCE } from '@/shared/components/tab-bar/constants';
import { TextField } from '@/shared/components/TextField';
import { confirm } from '@/shared/utils/confirm';
import { spacing, useTheme } from '@/theme';

import { useEditReceipt } from './hooks/useEditReceipt';
import { useReceiptDownload } from './hooks/useReceiptDownload';

/** Edit a whole receipt, or a single manual expense, which is a one-line receipt. */
export function EditReceiptScreen() {
  const params = useLocalSearchParams<{ spaceId: string; receiptId?: string; expenseId?: string }>();
  const spaceId = Number(params.spaceId);
  const { data, isLoading, error, refetch } = useSpaceExpenses(spaceId);

  const originals = useMemo(() => {
    const all = data ?? [];
    if (params.receiptId) return all.filter(e => e.receiptId === Number(params.receiptId));
    return all.filter(e => e.id === Number(params.expenseId));
  }, [data, params.receiptId, params.expenseId]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Couldn't load this receipt." onRetry={() => refetch()} />;
  if (originals.length === 0) return <EmptyState title="Receipt not found" message="It may have been deleted." />;

  // Keyed so the form starts fresh if the route points at a different receipt.
  return <EditReceiptForm key={originals.map(e => e.id).join(',')} spaceId={spaceId} originals={originals} />;
}

function EditReceiptForm({ spaceId, originals }: { spaceId: number; originals: Expense[] }) {
  const router = useRouter();
  const { colors } = useTheme();
  const edit = useEditReceipt(spaceId, originals);
  // Only scanned receipts have a stored photo; manual expenses have no receipt id.
  const receiptId = originals[0].receiptId;
  const receiptDownload = useReceiptDownload(spaceId, receiptId);

  // Opened straight from a URL (web reload, deep link) there's no screen to go back to.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/expenses'));

  const count = edit.drafts.length;
  const total = edit.drafts.reduce((sum, d) => sum + (Number(d.unitPrice) || 0) * (Number(d.quantity) || 0), 0);
  const isReceipt = originals.length > 1;
  // Saved lines keep their expense id as the draft key, so only those have a page to open.
  const savedIds = new Set(originals.map(e => e.id));
  const viewItem = (expenseId: number) =>
    router.push({ pathname: '/expenses/[expenseId]', params: { expenseId: String(expenseId), spaceId: String(spaceId) } });

  const onSave = async () => {
    if (await edit.save()) close();
  };

  const onDelete = async () => {
    const confirmed = await confirm({
      title: isReceipt ? 'Delete receipt' : 'Delete expense',
      message: isReceipt
        ? `Delete all ${originals.length} items on this receipt? This cannot be undone.`
        : 'Are you sure you want to delete this expense? This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (confirmed && (await edit.deleteReceipt())) close();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.bgPage }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Card style={styles.summary}>
        <TextField label="Shop name" value={edit.merchant} onChangeText={edit.setMerchant} placeholder="Optional" />
        <View style={styles.summaryRow}>
          <View style={styles.summaryText}>
            <AppText variant="footnote" tone="secondary">
              {formatMediumDate(originals[0].date)}
            </AppText>
            <AppText variant="subhead" weight="600">
              {`${count} ${count === 1 ? 'item' : 'items'}`}
            </AppText>
          </View>
          <AppText variant="title3" weight="700" numeric>
            {formatMoney(total)}
          </AppText>
        </View>
        {receiptId != null && (
          <Button
            title="Download receipt"
            variant="secondary"
            onPress={receiptDownload.download}
            loading={receiptDownload.downloading}
          />
        )}
        {receiptDownload.error && (
          <AppText variant="footnote" tone="negative" accessibilityRole="alert">
            {receiptDownload.error}
          </AppText>
        )}
      </Card>

      {edit.saveError && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {edit.saveError}
        </AppText>
      )}
      {Object.keys(edit.errors).length > 0 && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          Fix the highlighted fields to save.
        </AppText>
      )}

      {edit.drafts.map((draft, index) => (
        <ExpenseItemCard
          key={draft.key}
          draft={draft}
          index={index}
          errors={edit.errors[draft.key]}
          canRemove={count > 1}
          onChange={patch => edit.update(draft.key, patch)}
          onRemove={() => edit.remove(draft.key)}
          showMerchant={false}
          showDate={false}
          onView={savedIds.has(draft.key) ? () => viewItem(draft.key) : undefined}
        />
      ))}

      <View style={styles.actions}>
        <Button title="Cancel" variant="secondary" onPress={close} style={styles.secondary} />
        <Button title="Save" onPress={onSave} loading={edit.saving} style={styles.primary} />
      </View>
      <Button
        title={isReceipt ? 'Delete receipt' : 'Delete expense'}
        variant="danger"
        onPress={onDelete}
        disabled={edit.saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE, gap: spacing.base },
  summary: { padding: spacing.base, gap: spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryText: { flex: 1, gap: spacing['2xs'] },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  secondary: { flex: 1 },
  primary: { flex: 2 },
});
