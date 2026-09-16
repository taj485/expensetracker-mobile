import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { radius, spacing, type Theme, typography, useTheme, useThemedStyles } from '@/theme';

import { AppText } from './AppText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
}

/** Labelled text input with focus ring and inline error, styled from the theme. */
export function TextField({ label, error, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="footnote" weight="600" tone="secondary" importantForAccessibility="no">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={error ?? undefined}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.textBrand}
        onFocus={e => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, focused && styles.focused, error != null && styles.invalid]}
        {...inputProps}
      />
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
    input: {
      ...typography.body,
      // A fixed lineHeight clips TextInput text on iOS; minHeight leaves room for Dynamic Type.
      lineHeight: undefined,
      minHeight: 50,
      minWidth: 0,
      // Our border is the focus ring; hide the browser's own outline on web.
      outlineWidth: 0,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
      color: colors.textPrimary,
    },
    focused: { borderColor: colors.borderFocus },
    invalid: { borderColor: colors.textNegative },
  });
