import { StyleSheet, Text } from 'react-native';

import { purple, useTheme } from '@/theme';

interface WordmarkProps {
  size?: number;
  /** On purple grounds both halves shift up the ramp so the two-tone split stays legible. */
  onBrand?: boolean;
}

/** "Re" in ink, "cave" in brand purple. */
export function Wordmark({ size = 34, onBrand = false }: WordmarkProps) {
  const { colors } = useTheme();

  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Recave"
      maxFontSizeMultiplier={1.2}
      style={[styles.wordmark, { fontSize: size, lineHeight: size * 1.15 }]}>
      <Text style={{ color: onBrand ? colors.textOnBrand : colors.textPrimary }}>Re</Text>
      <Text style={{ color: onBrand ? purple[300] : colors.textBrand }}>cave</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: { fontWeight: '800', letterSpacing: -0.6 },
});
