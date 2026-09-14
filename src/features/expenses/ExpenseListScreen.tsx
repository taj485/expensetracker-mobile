import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/shared/components/Screen';
import { colors, typography } from '@/theme';

export function ExpenseListScreen() {
  return (
    <Screen centered>
      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.body}>Coming soon.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.heading, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textSecondary },
});
