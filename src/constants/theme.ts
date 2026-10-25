/**
 * Warna aplikasi (light & dark) mengikuti palet "Floaty Azure". Primary = #0284C7.
 *
 * Dipakai dua arah:
 * - Arah lama (login/register/styles): akses `Colors.*` level atas.
 * - Arah baru (komponen place: ThemedText / ThemedView): akses `Colors.light` /
 *   `Colors.dark` lewat `useTheme()`. Key lama (text, background, backgroundElement,
 *   backgroundSelected, textSecondary) dipertahankan, ditambah key tambahan
 *   (surface, onPrimary, border, borderStrong, error) yang dibutuhkan bottom sheet detail.
 *
 * Catatan: DESIGN.md tidak mendefinisikan palet dark mode maupun warna teks sekunder;
 * nilai di blok `dark` adalah usulan sementara.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Palette Warna Floaty Azure
export const FloatyAzure = {
  primary: '#0284C7',     // Primary Azure
  secondary: '#025091',   // Dark Blue
  tertiary: '#38BDF8',    // Light Blue
  neutral: '#0F172A',     // Dark Text / Neutral
  warning: '#D97706',
} as const;

export const Colors = {
  // Akses langsung untuk komponen UI & Form Login/Register
  ...FloatyAzure,
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  inputBg: '#F1F5F9',
  inputBorder: '#E2E8F0',
  textSecondary: '#64748B',

  // Tema Light (Sesuai struktur bawaan Expo)
  light: {
    text: '#0f172a', // Neutral (Ink Deep Blue)
    background: '#f8fafc', // Canvas
    backgroundElement: '#f0f9ff', // Container fill
    backgroundSelected: '#e0f2fe', // Hover / selected fill, stroke kartu
    textSecondary: '#475569',
    surface: '#ffffff', // Kartu & sheet
    primary: FloatyAzure.primary,
    onPrimary: '#ffffff',
    secondary: FloatyAzure.secondary,
    tertiary: FloatyAzure.tertiary,
    border: '#e0f2fe',
    borderStrong: '#bae6fd', // Border input
    error: '#ba1a1a',
  },
  // Tema Dark (Sesuai struktur bawaan Expo)
  dark: {
    // [USULAN] seluruh blok dark — dipaket utuh dari detail-page karena nilainya
    // saling terpasangkan (surface/border/secondary harus satu keluarga).
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
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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