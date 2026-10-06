import { Pressable, StyleSheet, View } from 'react-native';

import { COMPACT_MAX_FONT_SCALE, spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

export interface UnderlineTab<K extends string> {
  key: K;
  label: string;
  /** Small line above the label, e.g. 'Mon' over '5'. */
  overline?: string;
  /** Read by screen readers instead of the visible text. */
  accessibilityLabel?: string;
  disabled?: boolean;
}

interface UnderlineTabsProps<K extends string> {
  tabs: UnderlineTab<K>[];
  selected: K;
  onSelect: (key: K) => void;
  accessibilityLabel?: string;
}

/** A row of equal-width tabs with an underline under the selected one. */
export function UnderlineTabs<K extends string>({ tabs, selected, onSelect, accessibilityLabel }: UnderlineTabsProps<K>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row} role="tablist" aria-label={accessibilityLabel}>
      {tabs.map(tab => {
        const isOn = tab.key === selected;
        return (
          <Pressable
            key={tab.key}
            role="tab"
            aria-selected={isOn}
            aria-disabled={tab.disabled}
            aria-label={tab.accessibilityLabel}
            disabled={tab.disabled}
            onPress={() => onSelect(tab.key)}
            style={({ pressed }) => [styles.tab, isOn && styles.selected, pressed && styles.pressed]}>
            {tab.overline != null && (
              <AppText
                variant="caption2"
                weight="500"
                tone={tab.disabled ? 'muted' : isOn ? 'brand' : 'secondary'}
                maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
                {tab.overline}
              </AppText>
            )}
            <AppText
              variant="footnote"
              weight={isOn ? '600' : '500'}
              tone={tab.disabled ? 'muted' : isOn ? 'brand' : 'secondary'}
              maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
      marginBottom: spacing.sm,
    },
    tab: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm - 2,
      paddingHorizontal: spacing.xs,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
      // Sit the underline on the row's border rather than above it.
      marginBottom: -StyleSheet.hairlineWidth,
    },
    selected: { borderBottomColor: colors.textBrand },
    pressed: { opacity: 0.6 },
  });
