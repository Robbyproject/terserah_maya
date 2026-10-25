import { BlurView } from 'expo-blur';
import { router, usePathname, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, Layout, Radii, Shadows, Spacing } from '@/theme';

const FAB_SIZE = 56;

export type TerserahTabBarProps = {
  onMatchPress?: () => void;
};

export function TerserahTabBar({ onMatchPress }: TerserahTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const bottomInset = Math.max(insets.bottom, Spacing.sm);
  const surfaceHeight = Layout.tabBarHeight + bottomInset;

  const isMatch = pathname.startsWith('/match');
  const isProfile = pathname.startsWith('/profile');

  const handleMatchClick = () => {
    if (onMatchPress) {
      onMatchPress();
    } else {
      // Mengarahkan ke /home sambil mengirim parameter openMatch
      router.navigate({
        pathname: '/home',
        params: { openMatch: Date.now().toString() },
      });
    }
  };

  return (
    <View style={[styles.container, { height: surfaceHeight + Layout.tabBarLift }]}>
      <View style={[styles.surface, { height: surfaceHeight, paddingBottom: bottomInset }]}>
        <BlurView
          intensity={80}
          tint="light"
          blurMethod="dimezisBlurViewSdk31Plus"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} />
        <View style={styles.row}>
          <TabItem label="Home" icon="home" href="/home" active={!isMatch && !isProfile} />
          <View style={styles.fabSlot} />
          <TabItem label="Profile" icon="person" href="/profile" active={isProfile} />
        </View>
      </View>
      <View style={styles.fabWrapper}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Match"
          accessibilityState={{ selected: isMatch }}
          onPress={handleMatchClick}
          style={[styles.fab, isMatch && styles.fabActive]}>
          <Icon name="casino" size={30} color={Colors.onPrimary} />
        </PressableScale>
        <AppText variant="labelSm" color={Colors.onSurface}>
          Match
        </AppText>
      </View>
    </View>
  );
}

function TabItem({
  label,
  icon,
  href,
  active,
}: {
  label: string;
  icon: string;
  href: Href;
  active: boolean;
}) {
  return (
    <PressableScale
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={() => {
        // Cegah re-navigasi jika tab sudah aktif
        if (!active) {
          router.navigate(href);
        }
      }}
      style={styles.tabItem}>
      <Icon name={icon} size={24} color={active ? Colors.primary : Colors.onSurfaceVariant} />
      <AppText variant="labelSm" color={active ? Colors.primary : Colors.onSurfaceVariant}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  surface: {
    width: '100%',
    justifyContent: 'flex-end',
    ...Shadows.topBar,
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlaySurface,
  },
  row: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.gutter,
  },
  tabItem: {
    minWidth: 64,
    minHeight: Layout.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  fabSlot: {
    width: FAB_SIZE,
  },
  fabWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 1,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: Radii.pill,
    backgroundColor: Colors.brandSky,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.fab,
  },
  fabActive: {
    borderWidth: 3,
    borderColor: Colors.primaryFixed,
  },
});