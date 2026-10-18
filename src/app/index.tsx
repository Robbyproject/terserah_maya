
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/home/app-header';
import { GreetingHeader } from '@/components/home/greeting-header';
import { InstantDecisionHero } from '@/components/home/instant-decision-hero';
import { LocationEditSheet } from '@/components/home/location-edit-sheet';
import { LocationPill } from '@/components/home/location-pill';
import { PopularPicks } from '@/components/home/popular-picks';
import { SavedCriteriaBar } from '@/components/home/saved-criteria-bar';
import { SponsorCarousel } from '@/components/home/sponsor-carousel';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { useAsync } from '@/hooks/use-async';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getSavedCriteria } from '@/services/criteria.service';
import { getNearbyPicks, getSponsors } from '@/services/discovery.service';
import { getActiveLocation } from '@/services/location.service';
import { getCurrentUser } from '@/services/user.service';
import { Colors, Layout, Spacing } from '@/theme';
import type { UserLocation } from '@/types';

export default function HomeScreen() {
  const padding = useScreenPadding();

  const { result: userResult } = useAsync(getCurrentUser);
  const { result: locationResult } = useAsync(getActiveLocation);
  const { result: criteriaResult } = useAsync(getSavedCriteria);
  const { result: sponsorResult } = useAsync(getSponsors);
  const { result: picksResult, reload: reloadPicks } = useAsync(getNearbyPicks);

  const flow = useMatchFlow();

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);

  useEffect(() => {
    if (locationResult.status === 'success') {
      setLocation(locationResult.data);
    }
  }, [locationResult]);

  const user = userResult.status === 'success' ? userResult.data : null;
  const criteria = criteriaResult.status === 'success' ? criteriaResult.data : null;
  const sponsors = sponsorResult.status === 'success' ? sponsorResult.data : null;

  function handleSaveLocation(updatedLocation: UserLocation) {
    setLocation(updatedLocation);
    setLocationSheetVisible(false);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, padding]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.section}>
            <GreetingHeader user={user} onOpenCriteria={flow.openSheet} />

            <LocationPill
              location={location}
              onEdit={() => setLocationSheetVisible(true)}
            />
          </View>

          <SponsorCarousel sponsors={sponsors} />

          <InstantDecisionHero onPress={flow.openSheet} />

          <SavedCriteriaBar
            criteria={criteria}
            onEdit={flow.openSheet}
          />

          <PopularPicks
            result={picksResult}
            onRetry={reloadPicks}
            onEditCriteria={flow.openSheet}
          />
        </View>
      </ScrollView>

      <AppHeader label="Home" />

      <MatchFlowModals flow={flow} criteria={criteria} />

      {locationSheetVisible ? (
        <LocationEditSheet
          location={location}
          onClose={() => setLocationSheetVisible(false)}
          onSave={handleSaveLocation}
        />
      ) : null}
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
