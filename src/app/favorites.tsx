import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { RestaurantCard } from '@/components/home/restaurant-card';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { TerserahTabBar } from '@/components/navigation/tab-bar';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/use-async';
import { useFavorites } from '@/hooks/use-favorites';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getSavedCriteria } from '@/services/criteria.service';
import { getAllPicks } from '@/services/discovery.service';
import { Colors, Layout, Radii, Spacing } from '@/theme';

const ALL_CATEGORIES = 'Semua';

export default function FavoritesScreen() {
  const padding = useScreenPadding();
  const { result, reload } = useAsync(getAllPicks);
  const { result: criteriaResult } = useAsync(getSavedCriteria);
  const flow = useMatchFlow();
  const [filter, setFilter] = useState(ALL_CATEGORIES);
  const { isFavorite, toggleFavorite } = useFavorites();

  const criteria = criteriaResult.status === 'success' ? criteriaResult.data : null;
  const restaurants = result.status === 'success' ? result.data : [];
  const categories = Array.from(new Set(restaurants.map((restaurant) => restaurant.category)));
  const visible =
    filter === ALL_CATEGORIES
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.category === filter);

  const resetFilter = () => setFilter(ALL_CATEGORIES);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.titleBlock}>
        <AppText variant="headlineMd">Favorit Korban Terserah</AppText>
        <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
          Paling sering dapat bintang lima minggu ini
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        <Chip
          label={ALL_CATEGORIES}
          variant={filter === ALL_CATEGORIES ? 'selected' : 'tint'}
          onPress={() => setFilter(ALL_CATEGORIES)}
        />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            variant={filter === category ? 'selected' : 'tint'}
            onPress={() => setFilter(category)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const listEmpty = (
    <View>
      {result.status === 'pending' ? (
        <View style={styles.skeletonList}>
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
          <PillButton label="Coba lagi" variant="secondary" size="sm" onPress={reload} />
        </View>
      ) : null}
      {result.status === 'success' && visible.length === 0 ? (
        <View style={styles.message}>
          <Icon name="search_off" size={28} color={Colors.primary} />
          <AppText variant="bodySm" color={Colors.onSurfaceVariant} style={styles.messageText}>
            Belum ada pilihan di kategori ini
          </AppText>
          <PillButton
            label="Lihat semua kategori"
            variant="secondary"
            size="sm"
            onPress={resetFilter}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[styles.listContent, padding]}
        showsVerticalScrollIndicator={false}
        data={visible}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        renderItem={({ item }) => (
          // TODO: buka halaman detail restoran saat branch `detail-page` siap.
          <RestaurantCard
            restaurant={item}
            nameLines={2}
            badge={item.topPick ? 'Terfavorit' : undefined}
            favorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
      <MatchFlowModals flow={flow} criteria={criteria} />
      <TerserahTabBar onMatchPress={flow.openSheet} />
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  list: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: Layout.maxContentWidth + Layout.marginMobile * 2,
    alignSelf: 'center',
    paddingHorizontal: Layout.marginMobile,
    gap: Spacing.md,
  },
  headerBlock: {
    gap: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  titleBlock: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  skeletonList: {
    gap: Spacing.md,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  skeletonBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  message: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
  },
  messageText: {
    textAlign: 'center',
  },
});
