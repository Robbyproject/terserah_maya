import { useCallback, useState } from 'react';

import { saveCriteria } from '@/services/criteria.service';
import { spinForMatch } from '@/services/discovery.service';
import type { MatchCriteria, RelaxedCriterion, Restaurant } from '@/types';

export type MatchFlow = {
  sheetVisible: boolean;
  spinning: boolean;
  match: Restaurant | null;
  relaxed: RelaxedCriterion[];
  canRespin: boolean;
  error: string | null;
  openSheet: () => void;
  closeSheet: () => void;
  spin: (criteria: MatchCriteria) => Promise<void>;
  dismissMatch: () => void;
  respin: () => void;
};

function shuffle(items: Restaurant[]): Restaurant[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }

  return copy;
}

export function useMatchFlow(): MatchFlow {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [match, setMatch] = useState<Restaurant | null>(null);
  const [candidates, setCandidates] = useState<Restaurant[]>([]);
  const [remaining, setRemaining] = useState<Restaurant[]>([]);
  const [relaxed, setRelaxed] = useState<RelaxedCriterion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const openSheet = useCallback(() => {
    setError(null);
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const dismissMatch = useCallback(() => {
    setMatch(null);
    setRemaining([]);
    setRelaxed([]);
  }, []);

  // Kocok ulang dari pool yang sudah diterima backend: tanpa request baru dan
  // tanpa mengulang kartu sampai pool habis.
  const respin = useCallback(() => {
    setError(null);

    const queue =
      remaining.length > 0
        ? remaining
        : shuffle(candidates.filter((restaurant) => restaurant.id !== match?.id));

    if (queue.length === 0) return;

    setMatch(queue[0]);
    setRemaining(queue.slice(1));
  }, [candidates, match, remaining]);

  const spin = useCallback(async (criteria: MatchCriteria) => {
    setSpinning(true);
    setError(null);

    try {
      const result = await spinForMatch(criteria);

      saveCriteria(criteria);
      setSheetVisible(false);
      setCandidates(result.candidates);
      setRelaxed(result.relaxed);
      setMatch(result.match);
      setRemaining(shuffle(result.candidates.filter((item) => item.id !== result.match.id)));
    } catch (cause) {
      // Alert tidak dirender di react-native-web, jadi error ditampilkan inline
      // di dalam sheet.
      setError(cause instanceof Error ? cause.message : 'Coba lagi sebentar lagi ya.');
    } finally {
      setSpinning(false);
    }
  }, []);

  return {
    sheetVisible,
    spinning,
    match,
    relaxed,
    canRespin: candidates.length > 1,
    error,
    openSheet,
    closeSheet,
    spin,
    dismissMatch,
    respin,
  };
}
