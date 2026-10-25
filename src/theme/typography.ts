import type { TextStyle } from 'react-native';

export const FontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  icon: 'MaterialSymbols_400Regular',
  iconFilled: 'MaterialSymbols_400Regular_Filled',
} as const;

export const Typography = {
  headlineXl: {
    fontFamily: FontFamily.extrabold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  },
  headlineLg: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.26,
  },
  headlineMd: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24,
  },
  headlineSm: {
    fontFamily: FontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  labelLg: {
    fontFamily: FontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  labelMd: {
    fontFamily: FontFamily.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.26,
  },
  labelSm: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.44,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

export type FontWeightName = keyof typeof FontFamily;
