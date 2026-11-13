import { Pressable, StyleSheet } from 'react-native';

import { spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';
import { Card } from './Card';

export interface KeyValueItem {
  label: string;
  value: string;
  /** Makes the row tappable. */
  onPress?: () => void;
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
        <Pressable
          key={item.label}
          accessible
          accessibilityRole={item.onPress ? 'button' : undefined}
          accessibilityLabel={`${item.label}: ${item.value}`}
          onPress={item.onPress}
          disabled={!item.onPress}
          style={({ pressed }) => [styles.row, index < items.length - 1 && styles.divider, pressed && styles.pressed]}>
          <AppText variant="subhead" tone="secondary">
            {item.label}
          </AppText>
          <AppText variant="subhead" weight="600" style={styles.value}>
            {item.value}
          </AppText>
        </Pressable>
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
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderDefault },
    // Wraps under the label at large Dynamic Type sizes instead of truncating.
    value: { flexShrink: 1, textAlign: 'right' },
  });
