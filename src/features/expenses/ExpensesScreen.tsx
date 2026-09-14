import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import type { ExpenseCategory } from '@/core/models/expense.model';
import { useSpaceExpenses } from '@/core/queries/expenseQueries';
import { useToggleStar } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { monthKeyOf, monthKeysBack } from '@/core/utils/dateUtils';
import { groupByReceipt, sumExpenses } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/QueryState';
import { StatTile } from '@/shared/components/StatTile';
import { TAB_BAR_CLEARANCE } from '@/shared/components/tab-bar/constants';
import { spacing, useTheme } from '@/theme';

import { ExpensesToolbar } from './components/ExpensesToolbar';
import { MonthChips } from './components/MonthChips';
import { ReceiptCard } from './components/ReceiptCard';

const MONTHS_SHOWN = 5;

export function ExpensesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { spaces, selectedSpace, selectSpace, isLoading: spacesLoading, error: spacesError, refetch } = useSelectedSpace();
  const expensesQuery = useSpaceExpenses(selectedSpace?.id ?? null);
  const toggleStar = useToggleStar();

  const [month, setMonth] = useState<string | null>(null);
  const [category, setCategory] = useState<ExpenseCategory | null>(null);

  const filtered = useMemo(
    () =>
      (expensesQuery.data ?? []).filter(
        e => (!month || monthKeyOf(e.date) === month) && (!category || e.category === category),
      ),
    [expensesQuery.data, month, category],
  );
  const receipts = useMemo(() => groupByReceipt(filtered), [filtered]);
  const monthKeys = useMemo(() => monthKeysBack(MONTHS_SHOWN), []);

  const onSelectSpace = (spaceId: number) => {
    selectSpace(spaceId);
    setMonth(null);
    setCategory(null);
  };

  if (spacesLoading || expensesQuery.isLoading) return <LoadingState />;
  if (spacesError || expensesQuery.error) {
    return <ErrorState message="Couldn't load expenses. Please try again." onRetry={() => { refetch(); expensesQuery.refetch(); }} />;
  }
  if (!selectedSpace) {
    return <EmptyState title="No spaces yet" message="Create a space on the web app to start tracking." />;
  }

  const spaceId = selectedSpace.id;

  return (
    <>
      <Stack.Screen options={{ title: selectedSpace.name }} />
      <ExpensesToolbar
        spaces={spaces}
        selectedSpace={selectedSpace}
        onSelectSpace={onSelectSpace}
        onToggleStar={() => toggleStar.mutate(selectedSpace)}
        category={category}
        onSelectCategory={setCategory}
      />

      <FlatList
        data={receipts}
        keyExtractor={receipt => receipt.key}
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: colors.bgPage }}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Separator}
        refreshControl={
          <RefreshControl
            refreshing={expensesQuery.isRefetching}
            onRefresh={() => expensesQuery.refetch()}
            tintColor={colors.iconBrand}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <MonthChips monthKeys={monthKeys} selected={month} onSelect={setMonth} />
            <View style={styles.stats}>
              <StatTile label={month ? 'Month total' : 'Total'} value={formatMoney(sumExpenses(filtered))} highlight />
              <StatTile label="Entries" value={String(filtered.length)} />
            </View>
          </View>
        }
        ListEmptyComponent={
          month || category ? (
            <EmptyState title="No matching expenses" message="Try another month or category." />
          ) : (
            <EmptyState title="No expenses yet" message="Scan a receipt or add an expense to get started." />
          )
        }
        renderItem={({ item }) => (
          <ReceiptCard
            receipt={item}
            onPressExpense={expenseId =>
              router.push({
                pathname: '/expenses/[expenseId]',
                params: { expenseId: String(expenseId), spaceId: String(spaceId) },
              })
            }
          />
        )}
      />
    </>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE, flexGrow: 1 },
  header: { paddingTop: spacing.sm, paddingBottom: spacing.base },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  separator: { height: spacing.md },
});
