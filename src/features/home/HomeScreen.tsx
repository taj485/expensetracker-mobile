import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

import { useSpaceExpenses } from '@/core/queries/expenseQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { currentMonthKey } from '@/core/utils/dateUtils';
import { categoryBreakdown, expensesInMonth, summariseMonth } from '@/core/utils/spendingUtils';
import { AppText } from '@/shared/components/AppText';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/QueryState';
import { ScrollScreen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { AddIcon, ExpensesIcon, ScanIcon } from '@/shared/icons/AppIcons';
import { spacing } from '@/theme';

import { BalanceCard } from './components/BalanceCard';
import { CategoryRow } from './components/CategoryRow';
import { HomeHeader } from './components/HomeHeader';
import { QuickAction } from './components/QuickAction';

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth0();
  const { selectedSpace, isLoading: spacesLoading, error: spacesError, refetch: refetchSpaces } = useSelectedSpace();
  const expensesQuery = useSpaceExpenses(selectedSpace?.id ?? null);

  const monthKey = currentMonthKey();
  const expenses = expensesQuery.data;
  const summary = useMemo(() => (expenses ? summariseMonth(expenses, monthKey) : null), [expenses, monthKey]);
  const categories = useMemo(
    () => (expenses ? categoryBreakdown(expensesInMonth(expenses, monthKey)) : []),
    [expenses, monthKey],
  );

  const refresh = () => {
    refetchSpaces();
    expensesQuery.refetch();
  };

  const renderBody = () => {
    if (spacesLoading || expensesQuery.isLoading) return <LoadingState />;
    if (spacesError || expensesQuery.error) {
      return <ErrorState message="Couldn't load your spending. Please try again." onRetry={refresh} />;
    }
    if (!selectedSpace || !summary) {
      return <EmptyState title="No spaces yet" message="Create a space on the web app to start tracking." />;
    }

    return (
      <>
        <AppText variant="footnote" tone="secondary" style={styles.spaceName} numberOfLines={1}>
          {selectedSpace.name}
        </AppText>
        <BalanceCard monthKey={monthKey} summary={summary} />

        <View style={styles.quickRow}>
          <QuickAction label="Scan" Icon={ScanIcon} onPress={() => router.push('/scan')} />
          <QuickAction label="Add" Icon={AddIcon} onPress={() => router.push('/add-expense')} />
          <QuickAction label="Expenses" Icon={ExpensesIcon} onPress={() => router.navigate('/expenses')} />
        </View>

        <SectionHeader title="Spending by category" />
        {categories.length === 0 ? (
          <EmptyState title="Nothing spent yet this month" message="Scan a receipt to see where it goes." />
        ) : (
          <View style={styles.categoryList}>
            {categories.map(spend => (
              <CategoryRow key={spend.category} spend={spend} />
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollScreen headerless onRefresh={refresh} refreshing={expensesQuery.isRefetching}>
      <HomeHeader name={user?.givenName ?? user?.name} />
      {renderBody()}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  spaceName: { marginBottom: spacing.sm },
  quickRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  categoryList: { gap: spacing.sm },
});
