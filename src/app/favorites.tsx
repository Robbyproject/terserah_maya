import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Linking, ScrollView, View } from 'react-native';

import { RestaurantCard } from '@/components/home/restaurant-card';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { PlaceDetailSheet, type PlaceDetailSheetHandle } from '@/components/place/place-detail-sheet';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/use-async';
import { useFavorites } from '@/hooks/use-favorites';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useSavedCriteria } from '@/hooks/use-saved-criteria';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getAllPicks } from '@/services/discovery.service';
import { styles } from '@/styles/favorite.style';
import { Colors, Radii, Spacing } from '@/theme';
import type { Restaurant } from '@/types';
import { restaurantToPlace } from '@/utils/place-from-restaurant';

const ALL_CATEGORIES = 'Semua';

// Perkiraan tinggi header agar kartu pertama tidak tertutup sebelum onLayout terhitung
const HEADER_CONTENT_ESTIMATE = 130;

function openExternal(url: string) {
  Linking.openURL(url).catch(() => {
    Alert.alert('Tidak bisa membuka tautan', url);
  });
}

export default function FavoritesScreen() {
  const padding = useScreenPadding();
  const { result, reload } = useAsync(getAllPicks);
  const criteria = useSavedCriteria();
  const flow = useMatchFlow();
  const [filter, setFilter] = useState(ALL_CATEGORIES);
  const [headerHeight, setHeaderHeight] = useState(() => padding.paddingTop + HEADER_CONTENT_ESTIMATE);
  const listRef = useRef<FlatList<Restaurant>>(null);
  const detailSheetRef = useRef<PlaceDetailSheetHandle>(null);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0 });
  }, [filter]);

  const restaurants = result.status === 'success' ? result.data : [];
  const categories = Array.from(new Set(restaurants.map((restaurant) => restaurant.category)));
  const visible =
    filter === ALL_CATEGORIES
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.category === filter);

  const resetFilter = () => setFilter(ALL_CATEGORIES);

  // Detail restoran: perilaku sama dengan kartu di homepage.
  const openDetail = useCallback((restaurant: Restaurant) => {
    setDetailRestaurant(restaurant);
    detailSheetRef.current?.open();
  }, []);

  const isDetailFavorite = detailRestaurant !== null && isFavorite(detailRestaurant.id);

  const handleToggleDetailFavorite = useCallback(() => {
    if (!detailRestaurant) return;
    toggleFavorite(detailRestaurant.id);
  }, [detailRestaurant, toggleFavorite]);

  const handleGo = useCallback(() => {
    if (!detailRestaurant) return;

    const place = restaurantToPlace(detailRestaurant);
    const destination = encodeURIComponent(
      place.address !== 'Alamat belum tersedia' ? place.address : place.name
    );
    openExternal(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  }, [detailRestaurant]);

  const handleAnother = useCallback(() => {
    if (!detailRestaurant || result.status !== 'success') return;

    const others = result.data.filter((restaurant) => restaurant.id !== detailRestaurant.id);
    if (others.length === 0) return;

    setDetailRestaurant(others[Math.floor(Math.random() * others.length)]);
  }, [detailRestaurant, result]);

  const handleCall = useCallback((phone: string) => {
    openExternal(`tel:${phone.replace(/\s+/g, '')}`);
  }, []);

  const handleWebsite = useCallback((url: string) => {
    openExternal(url);
  }, []);

  // Floating glass header dengan tombol kembali
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
        {/* Baris Atas: Tombol Back + Judul & Deskripsi */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs }}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Kembali ke menu utama"
            onPress={() => router.back()}
            style={{
              width: 38,
              height: 38,
              borderRadius: Radii.pill,
              backgroundColor: Colors.surfaceContainerLow,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="arrow_back" size={22} color={Colors.onSurface} />
          </PressableScale>

          <View style={{ flex: 1, gap: 1 }}>
            <AppText variant="headlineSm" numberOfLines={1}>
              Favorit Korban Terserah
            </AppText>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
              Paling sering dapat bintang lima minggu ini
            </AppText>
          </View>
        </View>

        {/* Baris Kategori Chips */}
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
          { paddingTop: headerHeight + Spacing.md },
        ]}
        scrollIndicatorInsets={{ top: headerHeight }}
        showsVerticalScrollIndicator={false}
        data={visible}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={listEmpty}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            nameLines={2}
            badge={item.topPick ? 'Terfavorit' : undefined}
            favorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => openDetail(item)}
          />
        )}
      />
      {floatingHeader}
      <MatchFlowModals flow={flow} criteria={criteria} />
      <PlaceDetailSheet
        ref={detailSheetRef}
        place={detailRestaurant ? restaurantToPlace(detailRestaurant) : null}
        isFavorite={isDetailFavorite}
        onToggleFavorite={handleToggleDetailFavorite}
        onGo={handleGo}
        onAnother={handleAnother}
        onCallPress={handleCall}
        onWebsitePress={handleWebsite}
      />
      {/* TerserahTabBar telah dihapus agar tab bar tersembunyi di halaman ini */}
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