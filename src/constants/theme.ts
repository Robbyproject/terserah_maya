/**
 * Warna mengikuti DESIGN.md ("Floaty Azure"). Primary = #0284c7.
 * Key lama (text, background, backgroundElement, backgroundSelected, textSecondary)
 * dipertahankan supaya ThemedText / ThemedView tetap jalan.
 *
 * Catatan: DESIGN.md tidak punya palet dark mode dan tidak mendefinisikan warna
 * teks sekunder. Nilai bertanda [USULAN] di bawah adalah pilihan sementara, bukan dari DESIGN.md.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a', // Neutral (Ink Deep Blue)
    background: '#f8fafc', // Canvas
    backgroundElement: '#f0f9ff', // Container fill
    backgroundSelected: '#e0f2fe', // Hover / selected fill, stroke kartu
    textSecondary: '#475569', // [USULAN]
    surface: '#ffffff', // Kartu & sheet
    primary: '#0284c7', // Sky Blue
    onPrimary: '#ffffff',
    secondary: '#025091', // Deep Cerulean
    tertiary: '#38bdf8', // Vivid Electric Light Blue
    border: '#e0f2fe',
    borderStrong: '#bae6fd', // Border input
    error: '#ba1a1a',
  },
  dark: {
    // [USULAN] seluruh blok dark
    text: '#e6f1fb',
    background: '#0b1220',
    backgroundElement: '#14243d',
    backgroundSelected: '#1e3a5f',
    textSecondary: '#94a3b8',
    surface: '#111c30',
    primary: '#0284c7',
    onPrimary: '#ffffff',
    secondary: '#7dd3fc', // #025091 terlalu gelap di atas background dark
    tertiary: '#38bdf8',
    border: '#1e3a5f',
    borderStrong: '#2b5280',
    error: '#fca5a5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const FontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Dari bagian `rounded` di DESIGN.md (rem dikonversi ke px, 1rem = 16). */
export const Radius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;