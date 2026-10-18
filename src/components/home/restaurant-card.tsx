import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { formatDistance, formatPriceRange } from '@/lib/format';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';
import type { Restaurant } from '@/types';

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress?: () => void;
  badge?: string;
  nameLines?: number;
};

export function RestaurantCard({ restaurant, onPress, badge, nameLines = 1 }: RestaurantCardProps) {
  const content = (
    <View style={styles.root}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityLabel={restaurant.name}
        />
        {badge ? (
          <View style={styles.badge}>
            <AppText variant="labelSm" color={Colors.inverseOnSurface} numberOfLines={1}>
              {badge}
            </AppText>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Chip label={restaurant.category} variant="tintHigh" size="sm" />
          <View style={styles.rating}>
            <Icon name="star" size={16} color={Colors.amber} filled />
            <AppText variant="labelMd" style={styles.ratingValue}>
              {restaurant.rating}
            </AppText>
          </View>
        </View>
        <AppText variant="headlineSm" numberOfLines={nameLines}>
          {restaurant.name}
        </AppText>
        <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
          {restaurant.description}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="labelSm" color={Colors.primary} style={styles.price}>
            {formatPriceRange(restaurant.price)}
          </AppText>
          <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
            •
          </AppText>
          <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
            📍 {formatDistance(restaurant.distanceKm)}
          </AppText>
        </View>
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={restaurant.name}
      onPress={onPress}
      style={styles.pressable}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.soft,
  },
  imageWrap: {
    width: 80,
    height: 80,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 1,
    maxWidth: 80,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.inverseSurface,
  },
  body: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    color: Colors.onSurface,
    fontFamily: FontFamily.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: 6,
  },
  price: {
    fontFamily: FontFamily.bold,
  },
});
