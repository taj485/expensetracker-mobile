import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

export function LoadingState() {
  const { colors } = useTheme();
  return (
    <View style={styles.centered} accessibilityLabel="Loading">
      <ActivityIndicator color={colors.iconBrand} />
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.centered}>
      <AppText variant="body" tone="secondary" style={styles.message}>
        {message}
      </AppText>
      {onRetry && <Button title="Try again" variant="secondary" onPress={onRetry} />}
    </View>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.centered}>
      <AppText variant="headline" style={styles.message}>
        {title}
      </AppText>
      {message && (
        <AppText variant="subhead" tone="secondary" style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
    padding: spacing['2xl'],
  },
  message: { textAlign: 'center' },
});
