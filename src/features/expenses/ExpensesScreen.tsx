import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

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

import { CategoryChips } from './components/CategoryChips';
import { MonthChips } from './components/MonthChips';
import { ReceiptCard } from './components/ReceiptCard';
import { SpaceHeaderActions } from './components/SpaceHeaderActions';
import {
  type ExpenseFilterParams,
  type ExpenseFilters,
  parseExpenseFilters,
  toExpenseFilterParams,
  toggleCategory,
} from './expenseFilters';

const MONTHS_SHOWN = 5;

export function ExpensesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { spaces, selectedSpace, isLoading: spacesLoading, error: spacesError, refetch } = useSelectedSpace();
  const expensesQuery = useSpaceExpenses(selectedSpace?.id ?? null);
  const toggleStar = useToggleStar();

  // Filters come from the URL, so Home's cards (and deep links) can open a filtered list.
  // Every value is validated by parseExpenseFilters, so the cast only names the expected keys.
  const params = useLocalSearchParams() as ExpenseFilterParams;
  const { month, categories } = parseExpenseFilters(params, selectedSpace?.id);
  const setFilter = (patch: Partial<ExpenseFilters>) => {
    if (!selectedSpace) return;
    // This screen's own navigation object, not router.setParams: with tabs, router.setParams can
    // update whichever route the router considers current (e.g. Home) instead of this one.
    navigation.setParams(toExpenseFilterParams(selectedSpace.id, { month, categories, ...patch }) as never);
  };
  // Stable key for memoising on the selection (the parsed array is new every render).
  const categoryKey = categories.join(',');

  const filtered = useMemo(
    () => {
      const wanted = categoryKey ? categoryKey.split(',') : [];
      return (expensesQuery.data ?? []).filter(
        e => (!month || monthKeyOf(e.date) === month) && (wanted.length === 0 || wanted.includes(e.category)),
      );
    },
    [expensesQuery.data, month, categoryKey],
  );
  const receipts = useMemo(() => groupByReceipt(filtered), [filtered]);
  const monthKeys = useMemo(() => monthKeysBack(MONTHS_SHOWN), []);

  const retry = () => {
    refetch();
    // refetch() ignores `enabled`, so only call it once there is a space to load.
    if (selectedSpace) expensesQuery.refetch();
  };

  if (spacesLoading || expensesQuery.isLoading) return <LoadingState />;
  if (spacesError || expensesQuery.error) {
    return <ErrorState message="Couldn't load expenses. Please try again." onRetry={retry} />;
  }
  if (!selectedSpace) {
    return <EmptyState title="No spaces yet" message="Create a space to start tracking." />;
  }

  const spaceId = selectedSpace.id;
  const spaceParams = { spaceId: String(spaceId) };

  return (
    <>
      <Stack.Screen options={{ title: selectedSpace.name }} />

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
            <SpaceHeaderActions
              space={selectedSpace}
              canToggleStar={spaces.length > 1}
              onToggleStar={() => toggleStar.mutate(selectedSpace)}
              onMembers={() => router.push({ pathname: '/space-members', params: spaceParams })}
              onShare={() => router.push({ pathname: '/share-space', params: spaceParams })}
              onSettings={() => router.push({ pathname: '/space-settings', params: spaceParams })}
            />
            <MonthChips monthKeys={monthKeys} selected={month} onSelect={value => setFilter({ month: value })} />
            <CategoryChips
              selected={categories}
              onToggle={category => setFilter({ categories: toggleCategory(categories, category) })}
              onClear={() => setFilter({ categories: [] })}
            />
            <View style={styles.stats}>
              <StatTile label={month ? 'Month total' : 'Total'} value={formatMoney(sumExpenses(filtered))} highlight />
              <StatTile label="Entries" value={String(filtered.length)} />
            </View>
          </View>
        }
        ListEmptyComponent={
          month || categories.length > 0 ? (
            <EmptyState title="No matching expenses" message="Try another month or more categories." />
          ) : (
            <EmptyState title="No expenses yet" message="Scan a receipt or add an expense to get started." />
          )
        }
        renderItem={({ item }) => (
          <ReceiptCard
            receipt={item}
            showUploader={selectedSpace.memberCount > 1}
            // Lines of a scanned receipt open the receipt, which links on to each item;
            // standalone expenses open their own page.
            onPressExpense={expenseId =>
              item.receiptId != null
                ? router.push({
                    pathname: '/expenses/receipt-edit',
                    params: { spaceId: String(spaceId), receiptId: String(item.receiptId) },
                  })
                : router.push({
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
