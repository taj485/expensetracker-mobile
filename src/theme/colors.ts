import type { ExpenseCategory } from '@/core/models/expense.model';

// Recave design tokens. Primitives and light values mirror the web client's src/styles.css
// (Figma file 5CATVjILnTav2fDiyUOsfA); dark values are the mobile dark-mode palette.

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

export interface CategoryColors {
  /** Solid colour for bars and chart slices. */
  base: string;
  /** Tinted fill behind badges and icons. */
  soft: string;
  /** Text/icon colour on the soft fill (contrast-checked). */
  ink: string;
}

export interface ColorTokens {
  bgPage: string;
  bgSurface: string;
  /** Sheets and menus — one level above cards. */
  bgElevated: string;
  bgSurfaceAlt: string;
  bgBrand: string;
  bgBrandPressed: string;
  bgBrandSoft: string;
  bgBrandDeep: string;
  bgAccent: string;

  textPrimary: string;
  textSecondary: string;
  /** Disabled and placeholder text only — never body text. */
  textMuted: string;
  textBrand: string;
  textOnBrand: string;
  textPositive: string;
  textNegative: string;
  statusWarning: string;

  borderDefault: string;
  borderStrong: string;
  borderFocus: string;
  iconDefault: string;
  iconBrand: string;

  category: Record<ExpenseCategory, CategoryColors>;
}

export const lightColors: ColorTokens = {
  bgPage: neutral[50],
  bgSurface: neutral[0],
  bgElevated: neutral[0],
  bgSurfaceAlt: neutral[100],
  bgBrand: purple[600],
  bgBrandPressed: purple[700],
  bgBrandSoft: purple[50],
  bgBrandDeep: purple[900],
  bgAccent: '#FF6B5B',

  textPrimary: neutral[900],
  textSecondary: neutral[500],
  textMuted: neutral[400],
  textBrand: purple[600],
  textOnBrand: neutral[0],
  textPositive: '#16A34A',
  textNegative: '#DC2626',
  statusWarning: '#F59E0B',

  borderDefault: neutral[200],
  borderStrong: neutral[300],
  borderFocus: purple[400],
  iconDefault: neutral[500],
  iconBrand: purple[600],

  category: {
    Food: { base: '#F97316', soft: '#FFF0E6', ink: '#C2410C' },
    Transport: { base: '#3B82F6', soft: '#E8F1FE', ink: '#1D4ED8' },
    Utilities: { base: '#10B981', soft: '#E6F7F1', ink: '#047857' },
    Entertainment: { base: '#A855F7', soft: '#F5EAFE', ink: '#7E22CE' },
    Health: { base: '#EC4899', soft: '#FDECF4', ink: '#BE185D' },
  },
};

// Tinted near-black grounds keep the lilac hue; surfaces get lighter as they rise (iOS
// dark-mode elevation). The accent steps up the ramp so it stays legible on dark.
export const darkColors: ColorTokens = {
  bgPage: '#0F0D1A',
  bgSurface: '#1C1A2B',
  bgElevated: '#242136',
  bgSurfaceAlt: neutral[800],
  bgBrand: purple[500],
  bgBrandPressed: purple[600],
  bgBrandSoft: '#251A45',
  bgBrandDeep: '#1E1440',
  bgAccent: '#FF7A6B',

  textPrimary: neutral[50],
  textSecondary: neutral[400],
  textMuted: neutral[600],
  textBrand: purple[400],
  textOnBrand: neutral[0],
  textPositive: '#4ADE80',
  textNegative: '#F87171',
  statusWarning: '#FBBF24',

  borderDefault: '#2E2B40',
  borderStrong: neutral[700],
  borderFocus: purple[400],
  iconDefault: neutral[400],
  iconBrand: purple[400],

  category: {
    Food: { base: '#FB923C', soft: '#3A2213', ink: '#FDBA74' },
    Transport: { base: '#60A5FA', soft: '#172A45', ink: '#93C5FD' },
    Utilities: { base: '#34D399', soft: '#0F3328', ink: '#6EE7B7' },
    Entertainment: { base: '#C084FC', soft: '#2E1D45', ink: '#D8B4FE' },
    Health: { base: '#F472B6', soft: '#3A1A2C', ink: '#F9A8D4' },
  },
};
