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

export function RestaurantCard({
  restaurant,
  onPress,
  badge,
  nameLines = 1,
  favorite = false,
  onToggleFavorite,
}: RestaurantCardProps) {
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
