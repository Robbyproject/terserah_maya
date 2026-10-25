import type { ViewStyle } from 'react-native';

import { Colors } from './colors';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
} as const;

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const Layout = {
  marginMobile: 16,
  gutter: 16,
  maxContentWidth: 448,
  headerHeight: 64,
  tabBarHeight: 64,
  tabBarLift: 28,
  hitTarget: 44,
} as const;

export const Shadows = {
  ambient: {
    shadowColor: Colors.brandCerulean,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  soft: {
    shadowColor: Colors.brandCerulean,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  glow: {
    shadowColor: Colors.brandSky,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  fab: {
    shadowColor: Colors.brandSky,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  topBar: {
    shadowColor: Colors.tabBarShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 12,
  },
} as const satisfies Record<string, ViewStyle>;
