import { Pressable, StyleSheet, View } from 'react-native';

import { COMPACT_MAX_FONT_SCALE, radius, type Theme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

export interface SegmentedOption<K extends string> {
  key: K;
  label: string;
  /** Read by screen readers instead of the visible text, e.g. 'Week' for 'W'. */
  accessibilityLabel?: string;
}

interface SegmentedControlProps<K extends string> {
  options: SegmentedOption<K>[];
  selected: K;
  onSelect: (key: K) => void;
  accessibilityLabel?: string;
}

/** iOS-style segmented control: equal-width options on a grey track, with a raised pill behind the selected one. */
export function SegmentedControl<K extends string>({ options, selected, onSelect, accessibilityLabel }: SegmentedControlProps<K>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.track} role="tablist" aria-label={accessibilityLabel}>
      {options.map(option => {
        const isOn = option.key === selected;
        return (
          <Pressable
            key={option.key}
            role="tab"
            aria-selected={isOn}
            aria-label={option.accessibilityLabel}
            onPress={() => onSelect(option.key)}
            style={[styles.segment, isOn && styles.selected]}>
            <AppText variant="subhead" weight={isOn ? '600' : '500'} maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = ({ colors, shadowCard }: Theme) =>
  StyleSheet.create({
    track: { flexDirection: 'row', padding: 2, borderRadius: radius.sm + 1, backgroundColor: colors.bgSurfaceAlt },
    segment: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: radius.sm - 1 },
    selected: { backgroundColor: colors.bgElevated, boxShadow: shadowCard },
  });
