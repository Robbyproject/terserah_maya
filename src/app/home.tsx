import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/home/app-header';
import { GreetingHeader } from '@/components/home/greeting-header';
import { InstantDecisionHero } from '@/components/home/instant-decision-hero';
import { LocationPill } from '@/components/home/location-pill';
import { PopularPicks } from '@/components/home/popular-picks';
import { SavedCriteriaBar } from '@/components/home/saved-criteria-bar';
import { SponsorCarousel } from '@/components/home/sponsor-carousel';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { PlaceDetailSheet, type PlaceDetailSheetHandle } from '@/components/place/place-detail-sheet';
// import { TerserahTabBar } from '@/components/navigation/tab-bar';
import { useAsync } from '@/hooks/use-async';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getSavedCriteria } from '@/services/criteria.service';
import { getNearbyPicks, getSponsors } from '@/services/discovery.service';
import { getActiveLocation } from '@/services/location.service';
import { getCurrentUser } from '@/services/user.service';
import { Colors, Layout, Spacing } from '@/theme';
import type { Restaurant } from '@/types';
import { restaurantToPlace } from '@/utils/place-from-restaurant';

function openExternal(url: string) {
  Linking.openURL(url).catch(() => {
    Alert.alert('Tidak bisa membuka tautan', url);
  });
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ openMatch?: string }>();
  const padding = useScreenPadding();
  const { result: userResult } = useAsync(getCurrentUser);
  const { result: locationResult } = useAsync(getActiveLocation);
  const { result: criteriaResult } = useAsync(getSavedCriteria);
  const { result: sponsorResult } = useAsync(getSponsors);
  const { result: picksResult, reload: reloadPicks } = useAsync(getNearbyPicks);
  const flow = useMatchFlow();

  const detailSheetRef = useRef<PlaceDetailSheetHandle>(null);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Menangkap sinyal openMatch saat user menekan ikon Match dari halaman lain (misal Profile)
  useEffect(() => {
    if (params.openMatch) {
      flow.openSheet();
    }
  }, [params.openMatch]);

  const user = userResult.status === 'success' ? userResult.data : null;
  const location = locationResult.status === 'success' ? locationResult.data : null;
  const criteria = criteriaResult.status === 'success' ? criteriaResult.data : null;
  const sponsors = sponsorResult.status === 'success' ? sponsorResult.data : null;

  // Sheet selalu ter-mount (index -1), jadi state isi & perintah buka boleh berurutan
  // di tick yang sama: React flush render sebelum animasi sheet selesai.
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

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, padding]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.section}>
            <GreetingHeader user={user} onOpenCriteria={flow.openSheet} />
            <LocationPill location={location} onEdit={flow.openSheet} />
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
      <AppHeader label="" />
      <MatchFlowModals flow={flow} criteria={criteria} />
      {/* <TerserahTabBar onMatchPress={flow.openSheet} /> */}
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