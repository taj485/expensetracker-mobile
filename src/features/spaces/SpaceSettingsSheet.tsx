import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { apiErrorMessage } from '@/core/api/apiErrors';
import { useDeleteSpace } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { formatMediumDate } from '@/core/utils/dateUtils';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { KeyValueList } from '@/shared/components/KeyValueList';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { confirm } from '@/shared/utils/confirm';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { MembersList } from './components/MembersList';

/** Space settings — the web app's settings menu (Delete space), with the space's details. */
export function SpaceSettingsSheet() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { spaceId } = useLocalSearchParams<{ spaceId: string }>();
  const { spaces } = useSelectedSpace();
  const space = spaces.find(s => s.id === Number(spaceId));
  const deleteSpace = useDeleteSpace();
  const [error, setError] = useState<string | null>(null);
  // The API rejects deletes from non-admins (403); don't offer it to them. This sheet can be
  // reached by link, not only from the admin-only settings button, so check here too.
  const canDelete = space?.isCurrentUserAdmin === true;

  async function confirmDelete() {
    if (!space || !canDelete) return;
    const confirmed = await confirm({
      title: 'Delete space',
      message: `Are you sure you want to delete "${space.name}"? Every expense in it goes too. This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;

    setError(null);
    try {
      await deleteSpace.mutateAsync(space.id);
      router.back();
    } catch (e) {
      setError(apiErrorMessage(e, 'Failed to delete the space. Please try again.'));
    }
  }

  return (
    <ScrollView style={styles.sheet} contentContainerStyle={styles.content}>
      <SheetHandle />
      <AppText variant="title3" weight="700" accessibilityRole="header">
        Space settings
      </AppText>

      {space && (
        <>
          <KeyValueList
            items={[
              { label: 'Name', value: space.name },
              { label: 'Your role', value: space.isCurrentUserAdmin ? 'Admin' : 'Member' },
              { label: 'Created', value: formatMediumDate(space.dateCreated) },
            ]}
          />
          <View style={styles.section}>
            <AppText variant="footnote" weight="600" tone="secondary" style={styles.dangerLabel}>
              {`Members (${space.memberCount})`}
            </AppText>
            <MembersList spaceId={space.id} />
          </View>
        </>
      )}

      {canDelete ? (
        <View style={styles.danger}>
          <AppText variant="footnote" weight="600" tone="secondary" style={styles.dangerLabel}>
            Danger zone
          </AppText>
          <Button title="Delete space" variant="danger" onPress={confirmDelete} loading={deleteSpace.isPending} />
          <AppText variant="footnote" tone="secondary">
            Deletes the space and every expense in it, for all members.
          </AppText>
          {error && (
            <AppText variant="footnote" tone="negative" accessibilityRole="alert">
              {error}
            </AppText>
          )}
        </View>
      ) : (
        space && (
          <AppText variant="footnote" tone="secondary">
            Only admins can delete this space.
          </AppText>
        )
      )}
    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
    section: { gap: spacing.sm },
    danger: { gap: spacing.sm, marginTop: spacing.sm },
    dangerLabel: { textTransform: 'uppercase', letterSpacing: 0.5 },
  });
