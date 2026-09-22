import { Pressable, StyleSheet, View } from 'react-native';

import type { ExpenseTable } from '@/core/models/expense-table.model';
import { AppText } from '@/shared/components/AppText';
import { IconButton } from '@/shared/components/IconButton';
import { GearIcon, ShareIcon, StarIcon } from '@/shared/icons/AppIcons';
import { spacing, useTheme } from '@/theme';

interface SpaceHeaderActionsProps {
  space: ExpenseTable;
  /** The web app won't unstar the only space. */
  canToggleStar: boolean;
  onToggleStar: () => void;
  onMembers: () => void;
  onShare: () => void;
  onSettings: () => void;
}

/**
 * Member count (opens the member list), then star, share and settings for the current space —
 * the web expense list's page-header buttons. Share and settings are admin-only, as on web.
 */
export function SpaceHeaderActions({ space, canToggleStar, onToggleStar, onMembers, onShare, onSettings }: SpaceHeaderActionsProps) {
  const { colors } = useTheme();
  const members = `${space.memberCount} ${space.memberCount === 1 ? 'member' : 'members'}`;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${members}${space.isCurrentUserAdmin ? ', you are an admin' : ''}`}
        accessibilityHint="Shows who is in this space"
        onPress={onMembers}
        hitSlop={spacing.sm}
        style={styles.meta}>
        <AppText variant="footnote" tone="secondary" numberOfLines={1}>
          <AppText variant="footnote" weight="600" tone="brand">
            {members}
          </AppText>
          {space.isCurrentUserAdmin ? ' · Admin' : ''}
        </AppText>
      </Pressable>

      <View style={styles.buttons}>
        <IconButton
          accessibilityLabel={space.isStarred ? 'Unstar this space' : 'Star this space'}
          selected={space.isStarred}
          disabled={!canToggleStar}
          onPress={onToggleStar}>
          <StarIcon color={space.isStarred ? colors.statusWarning : colors.iconDefault} filled={space.isStarred} />
        </IconButton>

        {space.isCurrentUserAdmin && (
          <>
            <IconButton accessibilityLabel="Share this space" onPress={onShare}>
              <ShareIcon color={colors.iconDefault} />
            </IconButton>
            <IconButton accessibilityLabel="Space settings" onPress={onSettings}>
              <GearIcon color={colors.iconDefault} size={17} />
            </IconButton>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  meta: { flex: 1 },
  buttons: { flexDirection: 'row', gap: spacing.sm },
});
