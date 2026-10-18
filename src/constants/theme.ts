/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Updated with Floaty Azure palette.
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
    text: FloatyAzure.neutral,
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    textSecondary: '#64748B',
    primary: FloatyAzure.primary,
    secondary: FloatyAzure.secondary,
    tertiary: FloatyAzure.tertiary,
  },
  // Tema Dark (Sesuai struktur bawaan Expo)
  dark: {
    text: '#FFFFFF',
    background: FloatyAzure.neutral,
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    textSecondary: '#94A3B8',
    primary: FloatyAzure.primary,
    secondary: FloatyAzure.secondary,
    tertiary: FloatyAzure.tertiary,
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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;