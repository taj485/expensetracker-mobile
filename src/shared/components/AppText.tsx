import { Text, type TextProps } from 'react-native';

import { type ColorTokens, typography, type TypographyVariant, useTheme } from '@/theme';

type TextTone = 'primary' | 'secondary' | 'muted' | 'brand' | 'onBrand' | 'positive' | 'negative';

const TONE_TOKEN: Record<TextTone, keyof ColorTokens> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  muted: 'textMuted',
  brand: 'textBrand',
  onBrand: 'textOnBrand',
  positive: 'textPositive',
  negative: 'textNegative',
};

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
  weight?: '400' | '500' | '600' | '700' | '800';
  /** Tabular figures so amounts line up in columns. */
  numeric?: boolean;
}

/** Text in one of Apple's text styles, coloured from the theme. Scales with Dynamic Type. */
export function AppText({ variant = 'body', tone = 'primary', weight, numeric, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        typography[variant],
        { color: colors[TONE_TOKEN[tone]] as string },
        weight && { fontWeight: weight },
        numeric && { fontVariant: ['tabular-nums'] },
        style,
      ]}
      {...rest}
    />
  );
}
