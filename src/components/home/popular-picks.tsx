import { router } from 'expo-router';
import { View } from 'react-native';

import { RestaurantCard } from '@/components/home/restaurant-card';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import type { AsyncResult } from '@/hooks/use-async';
import { useFavorites } from '@/hooks/use-favorites';
import { styles } from '@/styles/popular-picks.styles';
import { Colors, Radii } from '@/theme';
import type { Restaurant } from '@/types';

export type PopularPicksProps = {
  result: AsyncResult<Restaurant[]>;
  onRetry: () => void;
  onEditCriteria: () => void;
};

export function PopularPicks({ result, onRetry, onEditCriteria }: PopularPicksProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="headlineSm" numberOfLines={1} style={styles.heading}>
            {'Favorit Korban "Terserah"'}
          </AppText>
          <AppText
            variant="bodySm"
            color={Colors.onSurfaceVariant}
            numberOfLines={1}
            style={styles.subhead}>
            Paling sering dapet bintang lima minggu ini
          </AppText>
        </View>
        <PressableScale
          accessibilityRole="link"
          accessibilityLabel="Lihat semua favorit"
          onPress={() => router.push('/favorites')}
          style={styles.seeAll}>
          <AppText variant="labelSm" color={Colors.primary}>
            Lihat Semua
          </AppText>
          <Icon name="chevron_right" size={16} color={Colors.primary} />
        </PressableScale>
      </View>
      {result.status === 'pending' ? (
        <View style={styles.list}>
          <PickSkeleton />
          <PickSkeleton />
          <PickSkeleton />
        </View>
      ) : null}
      {result.status === 'error' ? (
        <View style={styles.message}>
          <Icon name="cloud_off" size={28} color={Colors.error} />
          <AppText variant="bodySm" color={Colors.onSurfaceVariant} style={styles.messageText}>
            {result.error.message}
          </AppText>
          <PillButton label="Coba lagi" variant="secondary" size="sm" onPress={onRetry} />
        </View>
      ) : null}
      {result.status === 'success' && result.data.length === 0 ? (
        <View style={styles.message}>
          <Icon name="search_off" size={28} color={Colors.primary} />
          <AppText variant="bodySm" color={Colors.onSurfaceVariant} style={styles.messageText}>
            Belum ada rekomendasi di radius ini. Coba lebarkan kriteria kamu.
          </AppText>
          <PillButton label="Ubah kriteria" variant="secondary" size="sm" onPress={onEditCriteria} />
        </View>
      ) : null}
      {result.status === 'success' && result.data.length > 0 ? (
        <View style={styles.list}>
          {result.data.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              favorite={isFavorite(restaurant.id)}
              onToggleFavorite={() => toggleFavorite(restaurant.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PickSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width={80} height={80} radius={Radii.md} />
      <View style={styles.skeletonBody}>
        <Skeleton width={96} height={18} radius={Radii.pill} />
        <Skeleton width={180} height={18} />
        <Skeleton width={140} height={14} />
        <Skeleton width={120} height={14} />
      </View>
    </View>
  );
}
