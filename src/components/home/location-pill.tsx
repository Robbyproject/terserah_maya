import { StyleSheet, Text, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAccuracy } from '@/lib/format';
import { Colors, FontFamily, Radii, Shadows, Spacing, Typography } from '@/theme';
import type { UserLocation } from '@/types';

export type LocationPillProps = {
  location: UserLocation | null;
  error?: string | null;
  onEdit: () => void;
};

export function LocationPill({ location, error = null, onEdit }: LocationPillProps) {
  // Hanya fix GPS yang bisa mengklaim presisi; area yang diketik bukan posisi.
  const approximate = location?.source === 'device' && location.precise === false;

  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <Icon name="location_on" size={20} color={Colors.primary} filled />
        {location ? (
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            <Text style={styles.labelStrong}>{location.label}</Text>
            {location.source === 'device' &&
            location.accuracyM !== null &&
            location.accuracyM !== undefined ? (
              <Text style={styles.labelMuted}> • {formatAccuracy(location.accuracyM)}</Text>
            ) : null}
            {approximate ? <Text style={styles.labelMuted}> • perkiraan</Text> : null}
          </Text>
        ) : error ? (
          <AppText variant="labelMd" color={Colors.onSurfaceVariant} numberOfLines={1}>
            Lokasi belum aktif
          </AppText>
        ) : (
          <Skeleton width={190} height={18} radius={Radii.sm} />
        )}
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Ubah lokasi"
        onPress={onEdit}
        style={styles.edit}>
        <AppText variant="labelMd" color={Colors.primary}>
          {!location && error ? 'Atur' : 'Ubah'}
        </AppText>
        <Icon name="tune" size={16} color={Colors.primary} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    ...Shadows.soft,
  },
  left: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.labelMd,
    flexShrink: 1,
  },
  labelStrong: {
    fontFamily: FontFamily.bold,
    color: Colors.onSurface,
  },
  labelMuted: {
    ...Typography.bodySm,
    fontFamily: FontFamily.regular,
    color: Colors.onSurfaceVariant,
  },
  edit: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
