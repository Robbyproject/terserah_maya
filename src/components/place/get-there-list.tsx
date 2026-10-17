import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TravelModeId, TravelOption } from '@/types/place';
import { formatDistance, formatDuration, getFastestTravel } from '@/utils/place-format';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

// Nama simbol iOS (SF Symbols) & Android/web (Material). Kalau `tsc` menolak salah satu nama, ganti di sini.
const MODE_META: Record<TravelModeId, { label: string; symbol: SymbolName }> = {
  drive: { label: 'Mobil', symbol: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' } },
  two_wheeler: { label: 'Motor', symbol: { ios: 'scooter', android: 'two_wheeler', web: 'two_wheeler' } },
  transit: { label: 'Transit', symbol: { ios: 'tram.fill', android: 'train', web: 'train' } },
  walk: { label: 'Jalan kaki', symbol: { ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' } },
};

type Props = { options: TravelOption[] };

export function GetThereList({ options }: Props) {
  const theme = useTheme();
  const fastest = getFastestTravel(options);

  return (
    <View style={styles.list}>
      {options.map((option) => {
        const meta = MODE_META[option.mode];
        const isBest = option === fastest;
        return (
          <ThemedView
            key={option.mode}
            type={isBest ? 'surface' : 'backgroundElement'}
            style={[styles.row, { borderColor: isBest ? theme.primary : 'transparent' }]}>
            <ThemedView type="surface" style={styles.iconBox}>
              <SymbolView name={meta.symbol} tintColor={theme.primary} size={20} />
            </ThemedView>

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <ThemedText type="smallBold">{meta.label}</ThemedText>
                {isBest ? (
                  <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                    <ThemedText style={[styles.badgeText, { color: theme.onPrimary }]}>Tercepat</ThemedText>
                  </View>
                ) : null}
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {option.summary ?? formatDistance(option.distanceMeters)}
              </ThemedText>
            </View>

            <ThemedText style={styles.duration}>{formatDuration(option.durationMinutes)}</ThemedText>
          </ThemedView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconBox: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  badge: { borderRadius: Radius.full, paddingHorizontal: Spacing.two, paddingVertical: 2 },
  badgeText: { fontFamily: FontFamily.extraBold, fontSize: 10, lineHeight: 14 },
  duration: { fontFamily: FontFamily.extraBold, fontSize: 15, lineHeight: 20 },
});