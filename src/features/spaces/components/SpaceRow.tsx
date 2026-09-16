import { Pressable, StyleSheet, View } from 'react-native';

import type { ExpenseTable } from '@/core/models/expense-table.model';
import { AppText } from '@/shared/components/AppText';
import { SpacesIcon } from '@/shared/icons/AppIcons';
import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

interface SpaceRowProps {
  space: ExpenseTable;
  active: boolean;
  /** Expense count, when that space's expenses are already loaded. */
  count: number | undefined;
  /** The web app won't unstar the only space, so the star isn't tappable then. */
  canToggleStar: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
}

/**
 * A space in the sidebar. Selecting and starring are sibling buttons rather than nested ones —
 * nested buttons are invalid HTML on web and ambiguous for VoiceOver.
 */
export function SpaceRow({ space, active, count, canToggleStar, onSelect, onToggleStar }: SpaceRowProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tint = active ? colors.textBrand : colors.textSecondary;

  return (
    <View style={[styles.row, active && styles.active]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={`${space.name}${count != null ? `, ${count} expenses` : ''}`}
        onPress={onSelect}
        style={({ pressed }) => [styles.select, pressed && !active && styles.pressed]}>
        <SpacesIcon color={tint} size={20} />
        <AppText variant="subhead" weight={active ? '600' : '500'} style={[styles.name, { color: tint }]} numberOfLines={1}>
          {space.name}
        </AppText>
        {count != null && (
          <AppText variant="footnote" weight="600" style={{ color: tint }} numeric maxFontSizeMultiplier={1.4}>
            {count}
          </AppText>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={space.isStarred ? `Unstar ${space.name}` : `Star ${space.name}`}
        accessibilityState={{ disabled: !canToggleStar }}
        disabled={!canToggleStar}
        onPress={onToggleStar}
        style={styles.star}>
        <AppText
          variant="subhead"
          maxFontSizeMultiplier={1.4}
          style={{ color: space.isStarred ? colors.statusWarning : colors.textMuted }}>
          {space.isStarred ? '★' : '☆'}
        </AppText>
      </Pressable>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md },
    active: { backgroundColor: colors.bgBrandSoft },
    select: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: 44,
      paddingVertical: spacing.md,
      paddingLeft: spacing.md,
      borderRadius: radius.md,
    },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    name: { flex: 1 },
    // 44pt square keeps the star an easy tap target next to the row.
    star: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  });
