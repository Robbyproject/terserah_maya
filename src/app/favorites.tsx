import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';

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
import { styles } from '@/styles/favorite.style';
import { Colors, Radii, Spacing } from '@/theme';
import type { Restaurant } from '@/types';

const ALL_CATEGORIES = 'Semua';

// Rough header content height so the first card clears the header before onLayout measures it.
const HEADER_CONTENT_ESTIMATE = 120;

export default function FavoritesScreen() {
  const padding = useScreenPadding();
  const { result, reload } = useAsync(getAllPicks);
  const { result: criteriaResult } = useAsync(getSavedCriteria);
  const flow = useMatchFlow();
  const [filter, setFilter] = useState(ALL_CATEGORIES);
  const [headerHeight, setHeaderHeight] = useState(() => padding.paddingTop + HEADER_CONTENT_ESTIMATE);
  const listRef = useRef<FlatList<Restaurant>>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Jump back to the first card whenever the category filter changes.
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0 });
  }, [filter]);

  const criteria = criteriaResult.status === 'success' ? criteriaResult.data : null;
  const restaurants = result.status === 'success' ? result.data : [];
  const categories = Array.from(new Set(restaurants.map((restaurant) => restaurant.category)));
  const visible =
    filter === ALL_CATEGORIES
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.category === filter);

  const resetFilter = () => setFilter(ALL_CATEGORIES);

  // Floating glass header: cards scroll under it while the title and chips stay pinned.
  const floatingHeader = (
    <View
      style={[styles.header, { paddingTop: padding.paddingTop }]}
      onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
      <BlurView
        intensity={70}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={styles.headerBlur}
      />
      <View style={styles.headerTint} />
      <View style={styles.headerContent}>
        <View style={styles.titleBlock}>
          <AppText variant="headlineMd">Favorit Korban Terserah</AppText>
          <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
            Paling sering dapat bintang lima minggu ini
          </AppText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chips}>
          <Chip
            label={ALL_CATEGORIES}
            variant={filter === ALL_CATEGORIES ? 'selected' : 'tint'}
            onPress={() => setFilter(ALL_CATEGORIES)}
            style={styles.chip}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={filter === category ? 'selected' : 'tint'}
              onPress={() => setFilter(category)}
              style={styles.chip}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  // Skeletons while loading, retry card on error, friendly note when a category is empty.
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
        ref={listRef}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          padding,
          // Runtime: measured header height (+ gap) keeps the first card from jumping under it.
          { paddingTop: headerHeight + Spacing.md },
        ]}
        scrollIndicatorInsets={{ top: headerHeight }}
        showsVerticalScrollIndicator={false}
        data={visible}
        keyExtractor={(item) => item.id}
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
      {floatingHeader}
      <MatchFlowModals flow={flow} criteria={criteria} />
      <TerserahTabBar onMatchPress={flow.openSheet} />
    </View>
  );
}

// Placeholder card shown three times while picks load.
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
