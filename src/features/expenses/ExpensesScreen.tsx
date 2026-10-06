import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useSpaceExpenses } from '@/core/queries/expenseQueries';
import { useToggleStar } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import {
  type DatePeriod,
  dayKeyOf,
  formatDayLabel,
  monthKeyOf,
  monthKeysBack,
  periodRange,
  type Weekday,
  weekDays,
} from '@/core/utils/dateUtils';
import { groupByReceipt, sumExpenses } from '@/core/utils/expenseUtils';
import { formatMoney } from '@/core/utils/moneyUtils';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/QueryState';
import { StatTile } from '@/shared/components/StatTile';
import { TAB_BAR_CLEARANCE } from '@/shared/components/tab-bar/constants';
import { SearchField } from '@/shared/components/SearchField';
import { type UnderlineTab, UnderlineTabs } from '@/shared/components/UnderlineTabs';
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
  matchesSearch,
  toggleMonth,
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
  const { months, period = null, weekday = null, categories, search = '' } = parseExpenseFilters(params, selectedSpace?.id);
  const setFilter = (patch: Partial<ExpenseFilters>) => {
    if (!selectedSpace) return;
    // This screen's own navigation object, not router.setParams: with tabs, router.setParams can
    // update whichever route the router considers current (e.g. Home) instead of this one.
    navigation.setParams(toExpenseFilterParams(selectedSpace.id, { months, period, weekday, categories, search, ...patch }) as never);
  };
  // Stable keys for memoising on the selection (the parsed arrays are new every render).
  const categoryKey = categories.join(',');
  const monthKey = months.join(',');
  const selectedDayKey = selectedDayDate(period, weekday);

  const filtered = useMemo(
    () => {
      const wanted = categoryKey ? categoryKey.split(',') : [];
      const wantedMonths = monthKey ? monthKey.split(',') : [];
      const range = selectedDayKey ? { start: selectedDayKey, end: selectedDayKey } : period ? periodRange(period) : null;
      return (expensesQuery.data ?? []).filter(
        e =>
          (wantedMonths.length === 0 || wantedMonths.includes(monthKeyOf(e.date))) &&
          (!range || (dayKeyOf(e.date) >= range.start && dayKeyOf(e.date) <= range.end)) &&
          (wanted.length === 0 || wanted.includes(e.category)) &&
          matchesSearch(e, search),
      );
    },
    [expensesQuery.data, monthKey, period, selectedDayKey, categoryKey, search],
  );
  const receipts = useMemo(() => groupByReceipt(filtered), [filtered]);
  const monthKeys = useMemo(() => monthKeysBack(MONTHS_SHOWN), []);

  // Day tabs drill into This week / Last week, with the whole week last (and the default).
  const days = period === 'this-week' || period === 'last-week' ? weekDays(period) : [];
  const dayTabs: UnderlineTab<Weekday | 'week'>[] = [
    ...days.map(d => ({
      key: d.key,
      overline: d.name,
      label: String(d.dayOfMonth),
      accessibilityLabel: formatDayLabel(d.date),
      disabled: d.isFuture,
    })),
    { key: 'week' as const, label: period === 'last-week' ? 'Last week' : 'This week' },
  ];
  const selectedTab = days.find(d => d.date === selectedDayKey)?.key ?? 'week';

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
            <MonthChips
              monthKeys={monthKeys}
              selected={months}
              period={period}
              onToggle={key => setFilter({ months: toggleMonth(months, key), period: null, weekday: null })}
              onClear={() => setFilter({ months: [], period: null, weekday: null })}
              // Tapping the selected period again shows all months.
              onSelectPeriod={p => setFilter({ period: p === period ? null : p, months: [], weekday: null })}
            />
            <CategoryChips
              selected={categories}
              onToggle={category => setFilter({ categories: toggleCategory(categories, category) })}
              onClear={() => setFilter({ categories: [] })}
            />
            {days.length > 0 && (
              <UnderlineTabs
                tabs={dayTabs}
                selected={selectedTab}
                onSelect={key => setFilter({ weekday: key === 'week' ? null : key })}
                accessibilityLabel="Filter by day"
              />
            )}
            <View style={styles.stats}>
              <StatTile label={selectedDayKey ? formatDayLabel(selectedDayKey) : totalLabel(period, months.length)} value={formatMoney(sumExpenses(filtered))} highlight />
              <StatTile label="Entries" value={String(filtered.length)} />
            </View>
            <SearchField
              value={search}
              onChangeText={text => setFilter({ search: text })}
              placeholder="Search products or shops"
              accessibilityLabel="Search expenses"
            />
          </View>
        }
        ListEmptyComponent={
          // This week is the default, so "no expenses yet" only when the space really is empty.
          (expensesQuery.data?.length ?? 0) > 0 ? (
            <EmptyState title="No matching expenses" message="Try another date or more categories." />
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

const PERIOD_TOTAL_LABELS: Record<DatePeriod, string> = { 'this-week': 'This week', 'last-week': 'Last week', today: 'Today' };

/** The date of the selected weekday; null outside a week period or for a day still to come. */
function selectedDayDate(period: DatePeriod | null, weekday: Weekday | null): string | null {
  if (!weekday || (period !== 'this-week' && period !== 'last-week')) return null;
  return weekDays(period).find(d => d.key === weekday && !d.isFuture)?.date ?? null;
}

function totalLabel(period: DatePeriod | null, monthCount: number): string {
  if (period) return PERIOD_TOTAL_LABELS[period];
  if (monthCount === 1) return 'Month total';
  return monthCount > 1 ? `${monthCount} months total` : 'Total';
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE, flexGrow: 1 },
  header: { paddingTop: spacing.sm, paddingBottom: spacing.base },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.base },
  separator: { height: spacing.md },
});
