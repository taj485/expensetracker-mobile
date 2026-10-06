import { useEffect, useRef } from 'react';
import { type LayoutRectangle, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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

/**
 * A row of tabs with an underline under the selected one. The tabs share the width when they fit
 * and scroll sideways when they don't, keeping the selected tab in view.
 */
export function UnderlineTabs<K extends string>({ tabs, selected, onSelect, accessibilityLabel }: UnderlineTabsProps<K>) {
  const styles = useThemedStyles(createStyles);
  const scrollRef = useRef<ScrollView>(null);
  const viewWidth = useRef(0);
  const tabLayouts = useRef<Partial<Record<K, LayoutRectangle>>>({});

  // Centre the selected tab where possible; scrollTo clamps at both ends.
  const scrollToSelected = () => {
    const layout = tabLayouts.current[selected];
    if (!layout || !viewWidth.current) return;
    scrollRef.current?.scrollTo({ x: Math.max(0, layout.x - (viewWidth.current - layout.width) / 2), animated: true });
  };

  // Only when the selection changes, so a re-render never snaps back a row the user has scrolled.
  // Layouts arrive after the first render, so the selected tab's onLayout also calls this.
  useEffect(scrollToSelected, [selected]);

  return (
    <View style={styles.row}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onLayout={e => {
          viewWidth.current = e.nativeEvent.layout.width;
        }}
        role="tablist"
        aria-label={accessibilityLabel}>
        {tabs.map(tab => {
          const isOn = tab.key === selected;
          const tone = tab.disabled ? 'muted' : isOn ? 'brand' : 'secondary';
          return (
            <Pressable
              key={tab.key}
              role="tab"
              aria-selected={isOn}
              aria-disabled={tab.disabled}
              aria-label={tab.accessibilityLabel}
              disabled={tab.disabled}
              onPress={() => onSelect(tab.key)}
              onLayout={e => {
                tabLayouts.current[tab.key] = e.nativeEvent.layout;
                if (isOn) scrollToSelected();
              }}
              style={({ pressed }) => [styles.tab, isOn && styles.selected, pressed && styles.pressed]}>
              {tab.overline != null && (
                <AppText variant="footnote" weight="500" tone={tone} maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
                  {tab.overline}
                </AppText>
              )}
              <AppText variant="callout" weight={isOn ? '700' : '600'} tone={tone} maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    row: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
      marginBottom: spacing.sm,
    },
    // flexGrow lets the tabs share the full width when they all fit.
    content: { flexGrow: 1 },
    tab: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // Comfortable tap target (Apple's minimum is 44pt).
      minWidth: 56,
      minHeight: 52,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    selected: { borderBottomColor: colors.textBrand },
    pressed: { opacity: 0.6 },
  });
