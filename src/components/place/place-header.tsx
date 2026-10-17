import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';
import {
  formatDistance,
  formatDuration,
  formatReviewCount,
  getDisplayDistance,
  getFastestTravel,
} from '@/utils/place-format';

type Props = { place: Place };

export function PlaceHeader({ place }: Props) {
  const theme = useTheme();
  const fastest = getFastestTravel(place.travel);
  const distance = getDisplayDistance(place.travel);
  const statusColor = place.isOpenNow ? theme.secondary : theme.error;

  const summary = [
    distance !== undefined ? formatDistance(distance) : null,
    fastest ? `Tercepat ${formatDuration(fastest.durationMinutes)}` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.name}>{place.name}</ThemedText>

      <View style={styles.row}>
        <ThemedView type="backgroundSelected" style={styles.chip}>
          <ThemedText type="small" themeColor="secondary" style={styles.chipText}>
            {place.category}
          </ThemedText>
        </ThemedView>

        <View style={styles.rating}>
          <SymbolView
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            tintColor="#f59e0b"
            size={16}
          />
          <ThemedText type="smallBold">{place.rating.toFixed(1)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            ({formatReviewCount(place.reviewCount)})
          </ThemedText>
        </View>

        {place.priceLevel ? (
          <ThemedText type="smallBold" themeColor="textSecondary">
            {'$'.repeat(place.priceLevel)}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <ThemedText type="smallBold" style={{ color: statusColor }}>
          {place.statusText}
        </ThemedText>
      </View>

      {summary ? (
        <ThemedText type="small" themeColor="textSecondary">
          {summary}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two + Spacing.half },
  name: { fontFamily: FontFamily.extraBold, fontSize: 26, lineHeight: 34, letterSpacing: -0.3 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  chip: { paddingHorizontal: 12, paddingVertical: Spacing.one, borderRadius: Radius.full },
  chipText: { fontFamily: FontFamily.bold, fontSize: 12, lineHeight: 16 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
});