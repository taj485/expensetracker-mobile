import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CloseIcon, SearchIcon } from '@/shared/icons/AppIcons';
import { radius, spacing, type Theme, typography, useTheme, useThemedStyles } from '@/theme';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel: string;
}

/**
 * Search input with a leading icon and a clear button, styled like TextField. TextField needs a
 * visible label, which a search bar doesn't have. The clear button is our own rather than iOS's
 * clearButtonMode, so Android gets one too.
 */
export function SearchField({ value, onChangeText, placeholder, accessibilityLabel }: SearchFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.field, focused && styles.focused]}>
      <SearchIcon color={colors.textSecondary} size={18} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.textBrand}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable
          role="button"
          aria-label="Clear search"
          onPress={() => onChangeText('')}
          hitSlop={spacing.sm}
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}>
          <CloseIcon color={colors.textSecondary} size={14} />
        </Pressable>
      )}
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 48,
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgSurface,
    },
    focused: { borderColor: colors.borderFocus },
    input: {
      ...typography.body,
      // A fixed lineHeight clips TextInput text on iOS; the row's minHeight leaves room for Dynamic Type.
      lineHeight: undefined,
      flex: 1,
      minWidth: 0,
      paddingVertical: spacing.sm,
      // The row's border is the focus ring; hide the browser's own outline on web.
      outlineWidth: 0,
      color: colors.textPrimary,
    },
    clear: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
  });
