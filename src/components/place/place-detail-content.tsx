import { SymbolView } from 'expo-symbols';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { GetThereList } from '@/components/place/get-there-list';
import { OpeningHours } from '@/components/place/opening-hours';
import { PlaceActions } from '@/components/place/place-actions';
import { PlaceHeader } from '@/components/place/place-header';
import { PlaceHero } from '@/components/place/place-hero';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';

/** Dipendekkan supaya header dan tombol aksi muat di posisi half sheet. */
const HERO_HEIGHT = 120;

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type Props = {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onGo: () => void;
  /** "Cari Lain": parent yang menutup sheet, spin ulang, lalu membuka lagi. */
  onAnother: () => void;
  onCopyAddress?: (address: string) => void;
  onCallPress?: (phone: string) => void;
  onWebsitePress?: (url: string) => void;
};

/**
 * Isi detail restoran tanpa scroll. Tombol aksi (PlaceActions) ada tepat di bawah header.
 * Parent (bottom sheet) yang membungkusnya dengan ScrollView.
 */
export function PlaceDetailContent({
  place,
  isFavorite,
  onToggleFavorite,
  onGo,
  onAnother,
  onCopyAddress,
  onCallPress,
  onWebsitePress,
}: Props) {
  const theme = useTheme();

  return (
    <View>
      <View style={styles.heroWrapper}>
        <PlaceHero
          photos={place.photos}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          height={HERO_HEIGHT}
        />
      </View>

      <View style={styles.body}>
        <PlaceHeader place={place} />
        <PlaceActions onGo={onGo} onAnother={onAnother} />

        <Section title="Alamat">
          <View style={styles.addressRow}>
            <SymbolView
              name={{ ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' }}
              tintColor={theme.primary}
              size={20}
            />
            <ThemedText type="small" style={styles.addressText}>
              {place.address}
            </ThemedText>
            {onCopyAddress ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Salin alamat"
                onPress={() => onCopyAddress(place.address)}
                style={({ pressed }) => pressed && styles.pressed}>
                <ThemedView type="backgroundSelected" style={styles.miniButton}>
                  <ThemedText type="smallBold" themeColor="secondary" style={styles.miniButtonText}>
                    Salin
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ) : null}
          </View>
        </Section>

        <Section title="Get there" hint="dari lokasimu">
          <GetThereList options={place.travel} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
            Estimasi perjalanan dari lokasimu sekarang.
          </ThemedText>
        </Section>

        <Section title="Jam buka">
          <OpeningHours hours={place.hoursByDay} />
        </Section>

        <Section title="Lokasi">
          {/* Placeholder. Pilihan peta (library / gambar statis) belum diputuskan. */}
          <ThemedView type="backgroundSelected" style={styles.map}>
            <SymbolView
              name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
              tintColor={theme.primary}
              size={32}
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.mapCredit}>
              Peta © Google
            </ThemedText>
          </ThemedView>
        </Section>

        {place.phone || place.website ? (
          <Section title="Kontak">
            {place.phone ? (
              <ContactRow
                icon={{ ios: 'phone.fill', android: 'call', web: 'call' }}
                label={place.phone}
                onPress={onCallPress ? () => onCallPress(place.phone!) : undefined}
              />
            ) : null}
            {place.website ? (
              <ContactRow
                icon={{ ios: 'globe', android: 'language', web: 'language' }}
                label={place.website}
                onPress={onWebsitePress ? () => onWebsitePress(place.website!) : undefined}
              />
            ) : null}
          </Section>
        ) : null}

        <ThemedText type="small" themeColor="textSecondary" style={styles.attribution}>
          Data restoran dari Google Maps Platform
        </ThemedText>
      </View>
    </View>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        {hint ? (
          <ThemedText type="small" themeColor="textSecondary">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function ContactRow({ icon, label, onPress }: { icon: SymbolName; label: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.contactRow, { borderBottomColor: theme.border }, pressed && styles.pressed]}>
      <SymbolView name={icon} tintColor={theme.primary} size={18} />
      <ThemedText type="small">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroWrapper: { paddingHorizontal: Spacing.three },
  body: { paddingHorizontal: Spacing.three + Spacing.one, paddingTop: 14 },
  section: { marginTop: 22, gap: Spacing.two + Spacing.half },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 16, lineHeight: 22 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two + Spacing.half },
  addressText: { flex: 1, lineHeight: 21 },
  miniButton: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  miniButtonText: { fontSize: 12, lineHeight: 16 },
  note: { fontSize: 12, lineHeight: 16 },
  map: { height: 130, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: Spacing.one },
  mapCredit: { position: 'absolute', left: 10, bottom: 6, fontSize: 10, lineHeight: 14 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: { opacity: 0.7 },
  attribution: { marginTop: 22, textAlign: 'center', fontSize: 11, lineHeight: 16 },
});