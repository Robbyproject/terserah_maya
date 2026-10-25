import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { formatDistance, formatPriceRange } from '@/lib/format';
import { styles } from '@/styles/restaurant-card.styles';
import { Colors } from '@/theme';
import type { Restaurant } from '@/types';

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress?: () => void;
  badge?: string;
  nameLines?: number;
  favorite?: boolean;
  onToggleFavorite?: () => void;
};

// Required: id, name, category. Optional: imageUrl (neutral placeholder shown),
// description, rating, price, distanceKm — each line hides when missing.
export function RestaurantCard({
  restaurant,
  onPress,
  badge,
  nameLines = 1,
  favorite = false,
  onToggleFavorite,
}: RestaurantCardProps) {
  const hasRating = restaurant.rating != null;
  const hasPrice = restaurant.price != null;
  const hasDistance = restaurant.distanceKm != null;

  const content = (
    <View style={styles.root}>
      <View style={styles.imageWrap}>
        {restaurant.imageUrl ? (
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            accessibilityLabel={restaurant.name}
          />
        ) : (
          <View style={styles.imagePlaceholder} accessibilityLabel={restaurant.name}>
            <Icon name="restaurant" size={32} color={Colors.onSurfaceVariant} />
          </View>
        )}
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
            {hasRating ? (
              <>
                <Icon name="star" size={16} color={Colors.amber} filled />
                <AppText variant="labelMd" style={styles.ratingValue}>
                  {restaurant.rating}
                </AppText>
              </>
            ) : null}
            {onToggleFavorite ? (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={
                  favorite
                    ? `Hapus ${restaurant.name} dari favorit`
                    : `Simpan ${restaurant.name} ke favorit`
                }
                accessibilityState={{ selected: favorite }}
                hitSlop={8}
                onPress={onToggleFavorite}
                style={styles.bookmark}>
                <Icon
                  name="bookmark"
                  size={16}
                  color={favorite ? Colors.primary : Colors.onSurfaceVariant}
                  filled={favorite}
                />
              </PressableScale>
            ) : null}
          </View>
        </View>

        <AppText variant="headlineSm" numberOfLines={nameLines}>
          {restaurant.name}
        </AppText>
        {restaurant.description ? (
          <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
            {restaurant.description}
          </AppText>
        ) : null}

        {hasPrice || hasDistance ? (
          <View style={styles.metaRow}>
            {hasPrice ? (
              <AppText variant="labelSm" color={Colors.primary} style={styles.price}>
                {formatPriceRange(restaurant.price)}
              </AppText>
            ) : null}
            {hasPrice && hasDistance ? (
              <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
                •
              </AppText>
            ) : null}
            {hasDistance ? (
              <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
                📍 {formatDistance(restaurant.distanceKm)}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Buka detail ${restaurant.name}`}
      onPress={onPress}
      style={styles.pressable}>
      {content}
    </PressableScale>
  );
}