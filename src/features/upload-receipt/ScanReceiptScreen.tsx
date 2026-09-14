import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/shared/components/Screen';
import { colors, typography } from '@/theme';

export function ScanReceiptScreen() {
  return (
    <Screen centered>
      <Text style={styles.title}>Scan a receipt</Text>
      <Text style={styles.body}>Coming soon.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.heading, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textSecondary },
});
