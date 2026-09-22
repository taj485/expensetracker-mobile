import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { MembersList } from './components/MembersList';

/** Who's in a space. Anyone in the space can see this; admins can also invite from here. */
export function SpaceMembersSheet() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { spaceId } = useLocalSearchParams<{ spaceId: string }>();
  const { spaces } = useSelectedSpace();
  const space = spaces.find(s => s.id === Number(spaceId));

  return (
    <ScrollView style={styles.sheet} contentContainerStyle={styles.content}>
      <SheetHandle />
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Members
        </AppText>
        {space && (
          <AppText variant="subhead" tone="secondary">
            {`Everyone who can see and add expenses in "${space.name}".`}
          </AppText>
        )}
      </View>

      {space && <MembersList spaceId={space.id} />}

      {space?.isCurrentUserAdmin && (
        <Button
          title="Invite someone"
          variant="secondary"
          // Replace, so closing the share sheet returns to Expenses rather than stacking sheets.
          onPress={() => router.replace({ pathname: '/share-space', params: { spaceId: String(space.id) } })}
        />
      )}
    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
    header: { gap: spacing.xs },
  });
