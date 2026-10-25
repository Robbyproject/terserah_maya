import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { formatAccuracy } from '@/lib/format';
import {
  DEFAULT_RADIUS_KM,
  isLocationError,
  openAppSettings,
  resolveAreaLabel,
  resolveDeviceLocation,
} from '@/services/location.service';
import { Colors, Radii, Spacing, Typography } from '@/theme';
import type { UserLocation } from '@/types';

type LocationEditSheetProps = {
  location: UserLocation | null;
  onClose: () => void;
  onSave: (location: UserLocation) => void;
};

type DeviceFix =
  | { status: 'loading' }
  | { status: 'ready'; location: UserLocation }
  | { status: 'error'; error: Error };

const radiusOptions = [1, 3, 5, 10];

export function LocationEditSheet({
  location,
  onClose,
  onSave,
}: LocationEditSheetProps) {
  const [fix, setFix] = useState<DeviceFix>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [area, setArea] = useState('');
  const [radiusKm, setRadiusKm] = useState(
    location?.radiusKm ?? DEFAULT_RADIUS_KM,
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fix GPS dipakai sebagai pratinjau; radius baru ditempel saat pengguna
  // menekan "Pakai Lokasi Sekarang", jadi mengganti radius tidak memicu GPS lagi.
  useEffect(() => {
    let active = true;

    resolveDeviceLocation(DEFAULT_RADIUS_KM).then(
      (next) => {
        if (active) setFix({ status: 'ready', location: next });
      },
      (cause: unknown) => {
        if (!active) return;

        setFix({
          status: 'error',
          error:
            cause instanceof Error
              ? cause
              : new Error('Lokasi tidak tersedia.'),
        });
      },
    );

    return () => {
      active = false;
    };
  }, [attempt]);

  const retryFix = () => {
    setFix({ status: 'loading' });
    setAttempt((value) => value + 1);
  };

  const applyDevice = () => {
    if (fix.status !== 'ready') return;

    Keyboard.dismiss();
    onSave({ ...fix.location, radiusKm });
  };

  const applyArea = async () => {
    const trimmed = area.trim();

    if (!trimmed) {
      setErrorMsg('Masukkan nama lokasi terlebih dahulu.');
      return;
    }

    Keyboard.dismiss();
    setSaving(true);
    setErrorMsg('');

    try {
      onSave(await resolveAreaLabel(trimmed, radiusKm));
    } catch (cause) {
      // Alert tidak dirender di react-native-web, jadi pesan ini juga harus
      // tampil inline supaya kegagalan tidak terlihat seperti tombol mati.
      setErrorMsg(
        cause instanceof Error
          ? cause.message
          : 'Coba tulis nama daerah yang lebih spesifik.'
      );
    } finally {
      setSaving(false);
    }
  };

  const renderFix = () => {
    if (fix.status === 'loading') {
      return (
        <View style={styles.currentRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
            Mencari lokasi…
          </AppText>
        </View>
      );
    }

    if (fix.status === 'error') {
      const blocked = isLocationError(fix.error) && fix.error.reason === 'permission_blocked';

      return (
        <View style={styles.fixCard}>
          <AppText variant="bodySm" color={Colors.error}>
            {fix.error.message}
          </AppText>
          <View style={styles.fixActions}>
            {blocked ? (
              <PressableScale
                accessibilityRole="button"
                onPress={() => {
                  void openAppSettings();
                }}
                style={styles.action}>
                <AppText variant="labelMd" color={Colors.primary}>
                  Buka Pengaturan
                </AppText>
              </PressableScale>
            ) : null}
            <PressableScale
              accessibilityRole="button"
              onPress={retryFix}
              style={styles.action}>
              <AppText variant="labelMd" color={Colors.primary}>
                Coba lagi
              </AppText>
            </PressableScale>
          </View>
        </View>
      );
    }

    const { location: device } = fix;
    const approximate = device.precise === false;

    return (
      <View style={styles.fixCard}>
        <View style={styles.currentRow}>
          <Icon
            name="my_location"
            size={18}
            color={approximate ? Colors.amber : Colors.primary}
            filled
          />
          <AppText variant="labelMd" numberOfLines={1} style={styles.fixLabel}>
            {device.label}
          </AppText>
          {device.accuracyM !== null && device.accuracyM !== undefined ? (
            <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
              {formatAccuracy(device.accuracyM)}
            </AppText>
          ) : null}
        </View>

        {device.areaLabel && device.areaLabel !== device.label ? (
          <AppText
            variant="bodySm"
            color={Colors.onSurfaceVariant}
            numberOfLines={1}
            style={styles.areaLabel}>
            {device.areaLabel}
          </AppText>
        ) : null}

        {approximate ? (
          <>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
              Lokasi masih perkiraan. Aktifkan akses presisi supaya hasilnya
              akurat.
            </AppText>
            <PressableScale
              accessibilityRole="button"
              onPress={() => {
                void openAppSettings();
              }}
              style={styles.action}>
              <AppText variant="labelMd" color={Colors.primary}>
                Aktifkan presisi
              </AppText>
            </PressableScale>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <BottomSheet onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="headlineSm">Ubah Lokasi</AppText>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
              Pakai posisimu sekarang, atau pilih area tertentu.
            </AppText>
          </View>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Tutup ubah lokasi"
            onPress={onClose}
            style={styles.close}>
            <Icon name="close" size={18} color={Colors.onSurface} />
          </PressableScale>
        </View>

        <AppText variant="labelMd">Radius pencarian</AppText>

        <View style={styles.radiusRow}>
          {radiusOptions.map((radius) => {
            const selected = radiusKm === radius;

            return (
              <PressableScale
                key={radius}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setRadiusKm(radius)}
                style={[styles.radiusOption, selected && styles.radiusSelected]}>
                <AppText
                  variant="labelMd"
                  color={selected ? Colors.onPrimary : Colors.onSurface}>
                  {radius} km
                </AppText>
              </PressableScale>
            );
          })}
        </View>

        <AppText variant="labelMd">Lokasi saat ini</AppText>

        {renderFix()}

        <PillButton
          label="Pakai Lokasi Sekarang"
          icon="my_location"
          size="lg"
          disabled={fix.status !== 'ready'}
          onPress={applyDevice}
          style={styles.saveButton}
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
            Atau pilih area
          </AppText>
          <View style={styles.divider} />
        </View>

        <TextInput
          value={area}
          onChangeText={(text) => {
            setArea(text);
            setErrorMsg('');
          }}
          placeholder="Contoh: Menteng, Jakarta Pusat"
          placeholderTextColor={Colors.onSurfaceVariant}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          style={styles.input}
          accessibilityLabel="Nama area pencarian"
        />

        {errorMsg ? (
          <AppText variant="bodySm" color={Colors.error}>
            {errorMsg}
          </AppText>
        ) : null}

        <PillButton
          label="Terapkan Area"
          icon="search"
          variant="secondary"
          size="lg"
          loading={saving}
          onPress={applyArea}
          style={styles.saveButton}
        />

        <PressableScale
          accessibilityRole="button"
          onPress={onClose}
          style={styles.cancel}>
          <AppText variant="labelMd" color={Colors.onSurfaceVariant}>
            Batal
          </AppText>
        </PressableScale>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixCard: {
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fixLabel: {
    flexShrink: 1,
  },
  areaLabel: {
    paddingLeft: 26,
  },
  fixActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  action: {
    alignSelf: 'flex-start',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  input: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  radiusOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  radiusSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveButton: {
    width: '100%',
    marginTop: Spacing.md,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
});
