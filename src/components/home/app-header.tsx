import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Logo } from '@/components/ui/logo';
import { Colors, Layout } from '@/theme';

export type AppHeaderProps = {
  label: string;
};

export function AppHeader({ label }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <BlurView
        intensity={70}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.tint} />
      <View style={styles.bar}>
        <Logo />
        <AppText variant="labelMd" color={Colors.onSurfaceVariant}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlaySurface,
  },
  bar: {
    height: Layout.headerHeight,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.marginMobile,
  },
});
