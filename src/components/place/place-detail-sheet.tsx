import {
  BottomSheet,
  BottomSheetScrollView,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';
import { useImperativeHandle, useRef, type Ref } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlaceDetailContent } from '@/components/place/place-detail-content';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Place } from '@/types/place';

/** Dua posisi berhenti: setengah layar dan hampir penuh. Di Android, hasilnya mengikuti dua state Material. */
const SNAP_POINTS = ['58%', '92%'];

export type PlaceDetailSheetHandle = {
  /** Buka di posisi half (snap point pertama). */
  open: () => void;
  close: () => void;
};

type Props = {
  ref?: Ref<PlaceDetailSheetHandle>;
  /** null = belum ada restoran terpilih (isi sheet dikosongkan). */
  place: Place | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onGo: () => void;
  /** "Cari Lain": parent yang menutup sheet, spin ulang, lalu membuka lagi. */
  onAnother: () => void;
  onClose?: () => void;
  onCopyAddress?: (address: string) => void;
  onCallPress?: (phone: string) => void;
  onWebsitePress?: (url: string) => void;
};

export function PlaceDetailSheet({
  ref,
  place,
  isFavorite,
  onToggleFavorite,
  onGo,
  onAnother,
  onClose,
  onCopyAddress,
  onCallPress,
  onWebsitePress,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.surface,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
      }}
      onClose={onClose}>
      <BottomSheetView style={[styles.container, { backgroundColor: theme.surface }]}>
        {place ? (
          <BottomSheetScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}>
            <PlaceDetailContent
              place={place}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onGo={onGo}
              onAnother={onAnother}
              onCopyAddress={onCopyAddress}
              onCallPress={onCallPress}
              onWebsitePress={onWebsitePress}
            />
          </BottomSheetScrollView>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
});