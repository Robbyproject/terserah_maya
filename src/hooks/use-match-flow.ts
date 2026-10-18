import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { spinForMatch } from '@/services/discovery.service';
import type { MatchCriteria, Restaurant } from '@/types';

export type MatchFlow = {
  sheetVisible: boolean;
  spinning: boolean;
  match: Restaurant | null;
  openSheet: () => void;
  closeSheet: () => void;
  spin: (criteria: MatchCriteria) => Promise<void>;
  dismissMatch: () => void;
  respin: () => void;
};

export function useMatchFlow(): MatchFlow {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [match, setMatch] = useState<Restaurant | null>(null);

  const openSheet = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const dismissMatch = useCallback(() => {
    setMatch(null);
  }, []);

  const respin = useCallback(() => {
    setMatch(null);
    setSheetVisible(true);
  }, []);

  const spin = useCallback(async (criteria: MatchCriteria) => {
    setSpinning(true);

    try {
      const restaurant = await spinForMatch(criteria);
      setSheetVisible(false);
      setMatch(restaurant);
    } catch (cause) {
      Alert.alert(
        'Gagal mengacak',
        cause instanceof Error ? cause.message : 'Coba lagi sebentar lagi ya.',
      );
    } finally {
      setSpinning(false);
    }
  }, []);

  return { sheetVisible, spinning, match, openSheet, closeSheet, spin, dismissMatch, respin };
}
