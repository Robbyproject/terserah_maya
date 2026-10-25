import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radii, Shadows, Spacing } from '@/theme';
import type { User } from '@/types';

export type GreetingHeaderProps = {
  user: User | null;
  onOpenCriteria: () => void;
};

export function GreetingHeader({ user, onOpenCriteria }: GreetingHeaderProps) {
  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 380, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 380, easing: Easing.in(Easing.quad) }),
      ),
      -1,
    );
  }, [wave]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: wave.value }],
  }));

  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <View style={styles.greetingRow}>
          {user ? (
            <AppText variant="headlineMd">Halo, {user.name}!</AppText>
          ) : (
            <Skeleton width={150} height={30} radius={Radii.sm} />
          )}
          <Animated.Text style={[styles.wave, waveStyle]}>👋</Animated.Text>
        </View>
        <AppText variant="bodyMd" color={Colors.onSurfaceVariant}>
          Hungry but zero clue? We got you covered.
        </AppText>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Atur kriteria match"
        onPress={onOpenCriteria}
        style={styles.mascot}>
        <Icon name="restaurant_menu" size={24} color={Colors.secondary} filled />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  copy: {
    flexShrink: 1,
    gap: Spacing.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wave: {
    fontSize: 24,
    lineHeight: 32,
  },
  mascot: {
    width: 48,
    height: 48,
    borderRadius: Radii.pill,
    backgroundColor: Colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    ...Shadows.soft,
  },
});
