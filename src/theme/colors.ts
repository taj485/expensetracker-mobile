// Recave design tokens — mirrors the primitives and semantic tokens in the web
// client's src/styles.css so both apps stay in sync with the Figma variables.

export const purple = {
  50: '#F4F0FE',
  100: '#EDE6FD',
  200: '#DCCFFB',
  300: '#C0A9F7',
  400: '#9B7AF0',
  500: '#7C4DEA',
  600: '#6C3AE0',
  700: '#5628C4',
  800: '#431E9C',
  900: '#2E1470',
} as const;

export const neutral = {
  0: '#FFFFFF',
  50: '#F7F5FD',
  100: '#F1EFF7',
  200: '#E7E4F0',
  300: '#D5D1E0',
  400: '#A8A3B8',
  500: '#7C7790',
  600: '#5C5773',
  700: '#423E56',
  800: '#2A2739',
  900: '#171526',
} as const;

export const colors = {
  bgPage: neutral[50],
  bgSurface: neutral[0],
  bgSurfaceAlt: neutral[100],
  bgBrand: purple[600],
  bgBrandPressed: purple[700],
  bgBrandSoft: purple[50],
  bgBrandDeep: purple[900],
  bgAccent: '#FF6B5B',

  textPrimary: neutral[900],
  textSecondary: neutral[500],
  // 2.4:1 on white — disabled/placeholder only, never body text
  textMuted: neutral[400],
  textBrand: purple[600],
  textOnBrand: neutral[0],
  textPositive: '#16A34A',
  textNegative: '#DC2626',

  borderDefault: neutral[200],
  borderStrong: neutral[300],
  iconDefault: neutral[500],
  iconBrand: purple[600],
} as const;
