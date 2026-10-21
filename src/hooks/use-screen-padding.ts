import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Layout, Spacing } from '@/theme';

export function useScreenPadding() {
  const insets = useSafeAreaInsets();

  return {
    paddingTop: insets.top + Spacing.lg,
    paddingBottom: Layout.tabBarHeight + Layout.tabBarLift + insets.bottom + Spacing.xxl,
  };
}
