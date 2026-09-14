import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/shared/components/QueryState';
import { spacing, type Theme, useThemedStyles } from '@/theme';

/** Add expense sheet. The form arrives in the expense management phase. */
export function AddExpenseSheet() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sheet}>
      <EmptyState title="Add expense" message="Adding expenses from your phone is coming soon." />
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, padding: spacing.lg, backgroundColor: colors.bgElevated },
  });
