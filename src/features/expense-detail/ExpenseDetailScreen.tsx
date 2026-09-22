import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDeleteExpense, useExpense } from '@/core/queries/expenseQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { formatMediumDate } from '@/core/utils/dateUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { uploaderLabel } from '@/core/utils/uploaderUtils';
import { ErrorState, LoadingState } from '@/shared/components/QueryState';
import { KeyValueList } from '@/shared/components/KeyValueList';
import { TAB_BAR_CLEARANCE } from '@/shared/components/tab-bar/constants';
import { spacing, useTheme } from '@/theme';

import { DetailHero } from './components/DetailHero';
import { ExpenseActionsMenu } from './components/ExpenseActionsMenu';

/** Height of the iOS navigation bar the hero sits under. */
const NAV_BAR_HEIGHT = 44;

export function ExpenseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ expenseId: string; spaceId: string }>();
  const spaceId = Number(params.spaceId);
  const expenseId = Number(params.expenseId);

  const { spaces } = useSelectedSpace();
  const { data: expense, isLoading, error, refetch } = useExpense(spaceId, expenseId);
  const deleteExpense = useDeleteExpense(spaceId);

  // White status bar over the purple hero only while this screen is focused — this screen
  // stays mounted when the user switches tabs, so a mounted <StatusBar> would leak.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('auto');
    }, []),
  );

  const confirmDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteExpense.mutate(expenseId, {
            onSuccess: () => router.back(),
            onError: () => Alert.alert('Delete failed', 'Failed to delete the expense. Please try again.'),
          }),
      },
    ]);
  };

  if (isLoading) return <LoadingState />;
  if (error || !expense) return <ErrorState message="Couldn't load this expense." onRetry={() => refetch()} />;

  const space = spaces.find(s => s.id === spaceId);
  const spaceName = space?.name;
  // Only worth showing in shared spaces; in a personal space every expense is yours.
  const addedBy = space && space.memberCount > 1 ? uploaderLabel(expense, 'full') : null;

  return (
    <>
      <ExpenseActionsMenu onDelete={confirmDelete} />

      <ScrollView
        // The hero draws under the transparent navigation bar, so manage the top inset ourselves.
        contentInsetAdjustmentBehavior="never"
        style={{ backgroundColor: colors.bgPage }}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}>
        <DetailHero expense={expense} topInset={insets.top + NAV_BAR_HEIGHT} />

        <View style={styles.body}>
          <KeyValueList
            items={[
              { label: 'Description', value: expense.description },
              { label: 'Date', value: formatMediumDate(expense.date) },
              { label: 'Unit price', value: formatMoney(expense.unitPrice) },
              { label: 'Quantity', value: String(expense.quantity) },
              ...(spaceName ? [{ label: 'Space', value: spaceName }] : []),
              ...(addedBy ? [{ label: 'Added by', value: addedBy }] : []),
            ]}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.base },
});
