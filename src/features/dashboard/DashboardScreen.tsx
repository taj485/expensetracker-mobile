import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useApiClient } from '@/core/api/useApiClient';
import type { ExpenseTable } from '@/core/models/expense-table.model';
import { getTables } from '@/core/services/expenseTableService';
import { Screen } from '@/shared/components/Screen';
import { colors, radius, spacing, typography } from '@/theme';

const LOAD_ERROR = 'Failed to load expense tables. Please try again.';

// First authenticated API call — proves the Auth0 token is accepted by ExpenseTrackerAPI.
export function DashboardScreen() {
  const api = useApiClient();
  const [tables, setTables] = useState<ExpenseTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load. State is only set in the promise callbacks (never synchronously in
  // the effect body), and ignored if the screen unmounts before the request settles.
  useEffect(() => {
    let cancelled = false;
    getTables(api)
      .then(result => {
        if (!cancelled) setTables(result);
      })
      .catch(() => {
        if (!cancelled) setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Pull-to-refresh
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setTables(await getTables(api));
      setError(null);
    } catch {
      setError(LOAD_ERROR);
    } finally {
      setRefreshing(false);
    }
  }, [api]);

  if (loading) {
    return (
      <Screen centered>
        <ActivityIndicator color={colors.iconBrand} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Your tables</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={tables}
        keyExtractor={table => String(table.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!error ? <Text style={styles.empty}>No expense tables yet.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.isStarred ? '★ ' : ''}
              {item.name}
            </Text>
            <Text style={styles.cardMeta}>
              {item.memberCount} {item.memberCount === 1 ? 'member' : 'members'}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.textPrimary },
  error: { ...typography.label, color: colors.textNegative },
  empty: { ...typography.body, color: colors.textSecondary },
  list: { gap: spacing.sm },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardTitle: { ...typography.heading, color: colors.textPrimary },
  cardMeta: { ...typography.caption, color: colors.textSecondary },
});
