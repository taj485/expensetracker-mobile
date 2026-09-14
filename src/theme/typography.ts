import type { TextStyle } from 'react-native';

// Apple's text styles at the default ("Large") content size. React Native scales these with
// the user's Dynamic Type setting (allowFontScaling is on by default), so layouts must let
// text grow — no fixed heights around text.
// https://developer.apple.com/design/human-interface-guidelines/typography#Specifications
export const typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

// Hero figures (balance, detail amount) sit outside Apple's scale.
export const displayTypography = {
  amount: { fontSize: 38, lineHeight: 44, fontWeight: '700', letterSpacing: -1 },
} satisfies Record<string, TextStyle>;

/** Caps growth where extra size would break a fixed-width control (tab bar, chips). */
export const COMPACT_MAX_FONT_SCALE = 1.4;
