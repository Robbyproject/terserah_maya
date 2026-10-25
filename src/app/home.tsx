import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/home/app-header';
import { GreetingHeader } from '@/components/home/greeting-header';
import { InstantDecisionHero } from '@/components/home/instant-decision-hero';
import { LocationEditSheet } from '@/components/home/location-edit-sheet';
import { LocationPill } from '@/components/home/location-pill';
import { PopularPicks } from '@/components/home/popular-picks';
import { SavedCriteriaBar } from '@/components/home/saved-criteria-bar';
import { SponsorCarousel } from '@/components/home/sponsor-carousel';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { PlaceDetailSheet, type PlaceDetailSheetHandle } from '@/components/place/place-detail-sheet';
import { useAsync } from '@/hooks/use-async';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useSavedCriteria } from '@/hooks/use-saved-criteria';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getNearbyPicks, getSponsors } from '@/services/discovery.service';
import { getActiveLocation, refreshActiveLocation, saveActiveLocation } from '@/services/location.service';
import { getCurrentUser } from '@/services/user.service';
import { Colors, Layout, Spacing } from '@/theme';
import type { Restaurant, UserLocation } from '@/types';
import { restaurantToPlace } from '@/utils/place-from-restaurant';

function openExternal(url: string) {
  Linking.openURL(url).catch(() => {
    Alert.alert('Tidak bisa membuka tautan', url);
  });
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ openMatch?: string }>();
  const padding = useScreenPadding();

  const { result: userResult } = useAsync(getCurrentUser);
  const { result: locationResult, reload: reloadLocation } = useAsync(getActiveLocation);
  const criteria = useSavedCriteria();
  const { result: sponsorResult } = useAsync(getSponsors);
  const { result: picksResult, reload: reloadPicks } = useAsync(getNearbyPicks);
  const flow = useMatchFlow();
  const { openSheet } = flow;

  const detailSheetRef = useRef<PlaceDetailSheetHandle>(null);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLocationSheetVisible, setLocationSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Efek penanganan tombol Match dengan jeda animasi yang mulus
  useEffect(() => {
    if (params.openMatch) {
      const timer = setTimeout(() => {
        openSheet();
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [openSheet, params.openMatch]);

  const user = userResult.status === 'success' ? userResult.data : null;
  const location = locationResult.status === 'success' ? locationResult.data : null;
  const locationError = locationResult.status === 'error' ? locationResult.error.message : null;
  const sponsors = sponsorResult.status === 'success' ? sponsorResult.data : null;

  const openDetail = useCallback((restaurant: Restaurant) => {
    setDetailRestaurant(restaurant);
    detailSheetRef.current?.open();
  }, []);

  const isDetailFavorite =
    detailRestaurant !== null && favoriteIds.includes(detailRestaurant.id);

  const handleToggleFavorite = useCallback(() => {
    if (!detailRestaurant) return;
    const id = detailRestaurant.id;
    setFavoriteIds((ids) =>
      ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]
    );
  }, [detailRestaurant]);

  const handleGo = useCallback(() => {
    if (!detailRestaurant) return;
    const place = restaurantToPlace(detailRestaurant);
    const destination = encodeURIComponent(
      place.address !== 'Alamat belum tersedia' ? place.address : place.name
    );
    openExternal(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  }, [detailRestaurant]);

  const handleAnother = useCallback(() => {
    if (!detailRestaurant || picksResult.status !== 'success') return;
    const others = picksResult.data.filter((r) => r.id !== detailRestaurant.id);
    if (others.length === 0) return;
    setDetailRestaurant(others[Math.floor(Math.random() * others.length)]);
  }, [detailRestaurant, picksResult]);

  const handleCall = useCallback((phone: string) => {
    openExternal(`tel:${phone.replace(/\s+/g, '')}`);
  }, []);

  const handleWebsite = useCallback((url: string) => {
    openExternal(url);
  }, []);

  const handleSaveLocation = useCallback(
    async (newLocation: UserLocation) => {
      try {
        if (typeof saveActiveLocation === 'function') {
          await saveActiveLocation(newLocation);
        }
        setLocationSheetVisible(false);
        reloadLocation();
        reloadPicks();
      } catch {
        Alert.alert('Gagal Menyimpan', 'Tidak bisa memperbarui lokasi.');
      }
    },
    [reloadLocation, reloadPicks]
  );

  // Tarik untuk memperbarui: ambil fix GPS baru, lalu muat ulang pill dan daftar.
  // Kegagalan tidak perlu Alert (stub di web); pill menampilkan alasannya, dan
  // lokasi lama tetap dipakai kalau refresh gagal.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshActiveLocation();
    } catch {
      // Biarkan pill / daftar yang melaporkan.
    } finally {
      setRefreshing(false);
      reloadLocation();
      reloadPicks();
    }
  }, [reloadLocation, reloadPicks]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          padding,
          { paddingTop: insets.top + Spacing.xs },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }>
        <View style={styles.inner}>
          <AppHeader label="" />

          <View style={styles.section}>
            <GreetingHeader user={user} onOpenCriteria={flow.openSheet} />
            <LocationPill
              location={location}
              error={locationError}
              onEdit={() => setLocationSheetVisible(true)}
            />
          </View>

          <SponsorCarousel sponsors={sponsors} />
          <InstantDecisionHero onPress={flow.openSheet} />
          <SavedCriteriaBar criteria={criteria} onEdit={flow.openSheet} />
          <PopularPicks
            result={picksResult}
            onRetry={reloadPicks}
            onEditCriteria={flow.openSheet}
            onSelect={openDetail}
          />
        </View>
      </ScrollView>

      {/* Dipertahankan: Sheet Edit Lokasi */}
      {isLocationSheetVisible && (
        <LocationEditSheet
          location={location}
          onClose={() => setLocationSheetVisible(false)}
          onSave={handleSaveLocation}
        />
      )}

      <MatchFlowModals flow={flow} criteria={criteria} />
      <PlaceDetailSheet
        ref={detailSheetRef}
        place={detailRestaurant ? restaurantToPlace(detailRestaurant) : null}
        isFavorite={isDetailFavorite}
        onToggleFavorite={handleToggleFavorite}
        onGo={handleGo}
        onAnother={handleAnother}
        onCallPress={handleCall}
        onWebsitePress={handleWebsite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Layout.marginMobile,
  },
  inner: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
});