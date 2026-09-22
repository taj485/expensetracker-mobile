import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useSpaceMembers } from '@/core/queries/spaceQueries';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { spacing, useTheme } from '@/theme';

import { MemberRow } from './MemberRow';

/** Everyone in a space, from GET /api/expensetable/{id}/members. */
export function MembersList({ spaceId }: { spaceId: number }) {
  const { colors } = useTheme();
  const { data: members, isLoading, error, refetch } = useSpaceMembers(spaceId);

  if (isLoading) {
    return (
      <View style={styles.state} accessibilityLabel="Loading members">
        <ActivityIndicator color={colors.iconBrand} />
      </View>
    );
  }

  if (error || !members) {
    return (
      <View style={styles.state}>
        <AppText variant="footnote" tone="secondary">
          {"Couldn't load members."}
        </AppText>
        <Button title="Try again" variant="secondary" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <Card>
      {members.map((member, index) => (
        <MemberRow key={member.userId} member={member} isLast={index === members.length - 1} />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
});
