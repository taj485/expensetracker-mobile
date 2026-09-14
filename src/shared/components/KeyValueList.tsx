import { StyleSheet, View } from 'react-native';

import { spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';
import { Card } from './Card';

export interface KeyValueItem {
  label: string;
  value: string;
}

interface KeyValueListProps {
  items: KeyValueItem[];
}

/** Grouped label/value rows, like an iOS Settings or Contacts detail list. */
export function KeyValueList({ items }: KeyValueListProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Card>
      {items.map((item, index) => (
        <View
          key={item.label}
          accessible
          accessibilityLabel={`${item.label}: ${item.value}`}
          style={[styles.row, index < items.length - 1 && styles.divider]}>
          <AppText variant="subhead" tone="secondary">
            {item.label}
          </AppText>
          <AppText variant="subhead" weight="600" style={styles.value}>
            {item.value}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: spacing.base,
      rowGap: spacing['2xs'],
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderDefault },
    // Wraps under the label at large Dynamic Type sizes instead of truncating.
    value: { flexShrink: 1, textAlign: 'right' },
  });
