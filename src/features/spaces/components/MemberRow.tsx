import { StyleSheet, View } from 'react-native';

import type { ExpenseTableMember } from '@/core/models/expense-table.model';
import { AppText } from '@/shared/components/AppText';
import { Avatar } from '@/shared/components/Avatar';
import { radius, spacing, type Theme, useThemedStyles } from '@/theme';

interface MemberRowProps {
  member: ExpenseTableMember;
  isLast: boolean;
}

export function MemberRow({ member, isLast }: MemberRowProps) {
  const styles = useThemedStyles(createStyles);
  // The API only stores an email for users; older accounts may not have one yet.
  const label = member.email ?? 'Recave user';
  const role = member.isAdmin ? 'Admin' : 'Member';

  return (
    <View
      accessible
      accessibilityLabel={`${label}${member.isCurrentUser ? ' (you)' : ''}, ${role}`}
      style={[styles.row, !isLast && styles.divider]}>
      <Avatar name={member.email ?? undefined} size={36} />
      <View style={styles.text}>
        <AppText variant="subhead" weight="600" numberOfLines={1}>
          {label}
        </AppText>
        {member.isCurrentUser && (
          <AppText variant="caption1" tone="secondary">
            You
          </AppText>
        )}
      </View>
      <View style={[styles.badge, member.isAdmin && styles.adminBadge]}>
        <AppText variant="caption1" weight="600" tone={member.isAdmin ? 'brand' : 'secondary'} maxFontSizeMultiplier={1.4}>
          {role}
        </AppText>
      </View>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderDefault },
    text: { flex: 1, gap: spacing['2xs'] },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing['2xs'],
      borderRadius: radius.full,
      backgroundColor: colors.bgSurfaceAlt,
    },
    adminBadge: { backgroundColor: colors.bgBrandSoft },
  });
