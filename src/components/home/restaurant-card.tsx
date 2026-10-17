import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { formatDistance, formatPriceRange } from '@/lib/format';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';
import type { Restaurant } from '@/types';

export type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <View style={styles.root}>
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        accessibilityLabel={restaurant.name}
      />
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
        <AppText variant="headlineSm" numberOfLines={1}>
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
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.soft,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
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
