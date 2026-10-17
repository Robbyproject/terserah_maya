import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type DimensionValue,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { BUDGET_TIERS } from '@/constants/match';
import { formatDistance } from '@/lib/format';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';
import type { BudgetTier, Restaurant } from '@/types';

export type MatchResultModalProps = {
  restaurant: Restaurant;
  onClose: () => void;
  onRespin: () => void;
};

const CONFETTI = [
  { left: '12%', color: Colors.primaryContainer, delay: 0 },
  { left: '28%', color: Colors.secondaryContainer, delay: 300 },
  { left: '45%', color: Colors.tertiaryContainer, delay: 100 },
  { left: '63%', color: Colors.primary, delay: 500 },
  { left: '80%', color: Colors.secondaryFixed, delay: 200 },
  { left: '92%', color: Colors.tertiaryFixed, delay: 400 },
] as const;

export function MatchResultModal({ restaurant, onClose, onRespin }: MatchResultModalProps) {
  const openMaps = () => {
    const query = restaurant.address ? `${restaurant.name}, ${restaurant.address}` : restaurant.name;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
  };

  return (
    <Modal transparent animationType="none" onRequestClose={onClose} visible>
      <View style={styles.root}>
        <Animated.View entering={FadeIn.duration(220)} style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={40}
            tint="dark"
            blurMethod="dimezisBlurViewSdk31Plus"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.backdropTint} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup hasil match"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {CONFETTI.map((piece) => (
            <ConfettiPiece key={piece.left} left={piece.left} color={piece.color} delay={piece.delay} />
          ))}
        </View>
        <Animated.View
          entering={ZoomIn.duration(260).easing(Easing.out(Easing.cubic))}
          style={styles.card}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Tutup"
            onPress={onClose}
            style={styles.close}>
            <Icon name="close" size={18} color={Colors.onSurfaceVariant} />
          </PressableScale>
          <View style={styles.headline}>
            <Chip
              label="100% MATCH!"
              variant="accent"
              size="md"
              icon="celebration"
              style={styles.badge}
            />
            <AppText variant="headlineMd" style={styles.title}>
              Ketemu Jodoh Makanmu!
            </AppText>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant} style={styles.text}>
              Takdir udah milih, perut udah manggil. Cus berangkat!
            </AppText>
          </View>
          <View style={styles.restaurant}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: restaurant.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                accessibilityLabel={restaurant.name}
              />
              {restaurant.topPick ? (
                <View style={styles.topPick}>
                  <Icon name="verified" size={14} color={Colors.secondaryContainer} filled />
                  <AppText variant="labelSm" color={Colors.inverseOnSurface}>
                    Pilihan Teratas
                  </AppText>
                </View>
              ) : null}
              <View style={styles.rating}>
                <Icon name="star" size={14} color={Colors.amber} filled />
                <AppText variant="labelSm" style={styles.bold}>
                  {restaurant.rating}
                </AppText>
              </View>
            </View>
            <View style={styles.restaurantCopy}>
              <View style={styles.nameRow}>
                <AppText variant="headlineSm" numberOfLines={1} style={styles.name}>
                  {restaurant.name}
                </AppText>
                {restaurant.budgetTier ? (
                  <Chip label={findBudgetLabel(restaurant.budgetTier)} variant="accent" size="sm" />
                ) : null}
              </View>
              {restaurant.address ? (
                <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
                  {restaurant.address}
                </AppText>
              ) : null}
              <View style={styles.meta}>
                {restaurant.closesAt ? (
                  <View style={styles.metaItem}>
                    <Icon name="schedule" size={14} color={Colors.secondary} />
                    <AppText variant="labelSm" color={Colors.secondary} style={styles.bold}>
                      Buka sampai {restaurant.closesAt}
                    </AppText>
                  </View>
                ) : null}
                <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
                  📍 {formatDistance(restaurant.distanceKm)} dari posisimu
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.actions}>
            <PillButton
              label="Gas ke Sini! (Buka Maps)"
              size="lg"
              onPress={openMaps}
              style={styles.actionButton}
            />
            <PillButton
              label="Cari Lain 🎲"
              variant="neutral"
              icon="casino"
              onPress={onRespin}
              style={styles.actionButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function findBudgetLabel(tier: BudgetTier): string {
  return BUDGET_TIERS.find((option) => option.tier === tier)?.label ?? tier;
}

function ConfettiPiece({
  left,
  color,
  delay,
}: {
  left: DimensionValue;
  color: string;
  delay: number;
}) {
  const { height } = useWindowDimensions();
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2800, easing: Easing.linear }), -1, false),
    );
  }, [delay, fall]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fall.value * height }, { rotate: `${fall.value * 540}deg` }],
    opacity: fall.value < 0.15 ? fall.value / 0.15 : 1 - (fall.value - 0.15) * 0.9,
  }));

  return <Animated.View style={[styles.confetti, { left, backgroundColor: color }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  backdropTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlayInverse,
  },
  confetti: {
    position: 'absolute',
    top: -40,
    width: 10,
    height: 16,
    borderRadius: 2,
  },
  card: {
    width: '100%',
    maxWidth: 384,
    gap: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.ambient,
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  badge: {
    alignSelf: 'center',
  },
  title: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.extrabold,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  restaurant: {
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
    ...Shadows.soft,
  },
  imageWrapper: {
    width: '100%',
    height: 144,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topPick: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.overlayInverse,
  },
  rating: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    backgroundColor: Colors.overlayWhiteStrong,
  },
  restaurantCopy: {
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    flexShrink: 1,
    fontFamily: FontFamily.bold,
  },
  meta: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bold: {
    fontFamily: FontFamily.bold,
  },
  actions: {
    gap: Spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});
