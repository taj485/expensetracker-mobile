import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Avatar } from '@/shared/components/Avatar';
import { spacing } from '@/theme';

interface HomeHeaderProps {
  name: string | undefined;
}

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeHeader({ name }: HomeHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="footnote" tone="secondary">
          {greetingFor(new Date().getHours())}
        </AppText>
        <AppText variant="title3" weight="700" accessibilityRole="header" numberOfLines={1}>
          {name ?? 'there'}
        </AppText>
      </View>
      <Avatar name={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.lg },
  text: { flex: 1 },
});
