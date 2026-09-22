import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScanIcon } from '@/shared/icons/AppIcons';
import { COMPACT_MAX_FONT_SCALE, purple, radius, spacing, type Theme, useThemedStyles } from '@/theme';

import { AppText } from '../AppText';
import { SCAN_BUTTON_OVERHANG } from './constants';

interface ScanTabButtonProps {
  onPress: () => void;
}

/**
 * Scan is the app's headline action (AI receipt extraction), so it gets the raised centre
 * slot rather than a generic "+". It opens the scan sheet instead of switching tabs.
 */
export function ScanTabButton({ onPress }: ScanTabButtonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Scan a receipt"
      onPress={onPress}
      style={({ pressed }) => [styles.slot, pressed && styles.pressed]}>
      <View style={styles.ring}>
        <LinearGradient
          colors={[purple[500], purple[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}>
          <ScanIcon color="#FFFFFF" />
        </LinearGradient>
      </View>
      <AppText variant="caption2" weight="600" tone="brand" maxFontSizeMultiplier={COMPACT_MAX_FONT_SCALE}>
        Scan
      </AppText>
    </Pressable>
  );
}

const BUTTON_SIZE = 60;
const RING_WIDTH = 4;

const createStyles = ({ colors, shadowBrand }: Theme) =>
  StyleSheet.create({
    slot: { alignItems: 'center', gap: spacing.xs, marginTop: -SCAN_BUTTON_OVERHANG },
    pressed: { transform: [{ scale: 0.96 }] },
    // The surface-coloured ring cuts the button out of the bar behind it.
    ring: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: radius.full,
      borderWidth: RING_WIDTH,
      borderColor: colors.bgSurface,
      boxShadow: shadowBrand,
      overflow: 'hidden',
    },
    button: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });
