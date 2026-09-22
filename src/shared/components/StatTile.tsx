import { StyleSheet } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Card } from './Card';

interface StatTileProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function StatTile({ label, value, highlight = false }: StatTileProps) {
  return (
    <Card style={styles.tile}>
      <AppText variant="caption2" tone="secondary" weight="600" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="title3" weight="700" tone={highlight ? 'brand' : 'primary'} numeric>
        {value}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, padding: spacing.md, gap: spacing.xs },
  label: { textTransform: 'uppercase', letterSpacing: 0.5 },
});
