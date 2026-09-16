import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

/** The mockup's large amount input: "£" prefix, big bold figure, decimal keypad. */
export function AmountField({ value, onChange, error }: AmountFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="footnote" weight="600" tone="secondary" importantForAccessibility="no">
        Unit price
      </AppText>
      <View style={[styles.box, focused && styles.focused, error != null && styles.invalid]}>
        <AppText style={styles.currency} tone="secondary" importantForAccessibility="no">
          £
        </AppText>
        <TextInput
          accessibilityLabel="Unit price in pounds"
          accessibilityHint={error ?? undefined}
          value={value}
          // Keep digits and a single decimal point, at most two decimal places.
          onChangeText={text => onChange(text.replace(/[^0-9.]/g, '').replace(/^(\d*\.?\d{0,2}).*$/, '$1'))}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.textBrand}
          keyboardType="decimal-pad"
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
      </View>
      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    field: { gap: 6 },
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.base,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
    },
    focused: { borderColor: colors.borderFocus },
    invalid: { borderColor: colors.textNegative },
    currency: { fontSize: 26, fontWeight: '700' },
    input: {
      flex: 1,
      // Lets the input shrink below its intrinsic width; without it the web input overflows the
      // row and autofocus scrolls the whole sheet sideways.
      minWidth: 0,
      // The box draws its own focus ring; hide the browser's outline on web.
      outlineWidth: 0,
      minHeight: 60,
      fontSize: 26,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: colors.textPrimary,
      fontVariant: ['tabular-nums'],
    },
  });
