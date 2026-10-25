
import { useState } from 'react';
import {
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
import { resolveLocationLabel } from '@/services/location.service';
import { Colors, Radii, Spacing, Typography } from '@/theme';
import type { UserLocation } from '@/types';

type LocationEditSheetProps = {
  location: UserLocation | null;
  onClose: () => void;
  onSave: (location: UserLocation) => void;
};

const radiusOptions = [1, 3, 5, 10];

export function LocationEditSheet({
  location,
  onClose,
  onSave,
}: LocationEditSheetProps) {
  const [label, setLabel] = useState(location?.label ?? '');
  const [radiusKm, setRadiusKm] = useState(
    location?.radiusKm ?? 3,
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function saveLocation() {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
      setErrorMsg('Masukkan nama lokasi terlebih dahulu.');
      return;
    }

    Keyboard.dismiss();
    setSaving(true);
    setErrorMsg('');

    try {
      const resolved = await resolveLocationLabel(trimmedLabel, radiusKm);
      onSave(resolved);
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
  }

  return (
    <BottomSheet onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="headlineSm">
              Ubah Lokasi
            </AppText>
            <AppText
              variant="bodySm"
              color={Colors.onSurfaceVariant}>
              Pilih lokasi dan jarak pencarian makanan.
            </AppText>
          </View>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Tutup ubah lokasi"
            onPress={onClose}
            style={styles.close}>
            <Icon
              name="close"
              size={18}
              color={Colors.onSurface}
            />
          </PressableScale>
        </View>

        <AppText variant="labelMd">
          Nama lokasi
        </AppText>

        <TextInput
          value={label}
          onChangeText={(text) => {
            setLabel(text);
            setErrorMsg('');
          }}
          placeholder="Contoh: Menteng, Jakarta Pusat"
          placeholderTextColor={Colors.onSurfaceVariant}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          style={styles.input}
          accessibilityLabel="Nama lokasi pencarian"
        />

        {errorMsg ? (
          <AppText variant="bodySm" color={Colors.error}>
            {errorMsg}
          </AppText>
        ) : null}

        <AppText variant="labelMd">
          Radius pencarian
        </AppText>

        <View style={styles.radiusRow}>
          {radiusOptions.map((radius) => {
            const selected = radiusKm === radius;

            return (
              <PressableScale
                key={radius}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setRadiusKm(radius)}
                style={[
                  styles.radiusOption,
                  selected && styles.radiusSelected,
                ]}>
                <AppText
                  variant="labelMd"
                  color={
                    selected
                      ? Colors.onPrimary
                      : Colors.onSurface
                  }>
                  {radius} km
                </AppText>
              </PressableScale>
            );
          })}
        </View>

        <PillButton
          label="Terapkan Lokasi"
          icon="location_on"
          size="lg"
          loading={saving}
          onPress={saveLocation}
          style={styles.saveButton}
        />

        <PressableScale
          accessibilityRole="button"
          onPress={onClose}
          style={styles.cancel}>
          <AppText
            variant="labelMd"
            color={Colors.onSurfaceVariant}>
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
