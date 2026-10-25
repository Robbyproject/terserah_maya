import { mockCriteria } from '@/mocks/criteria';
import type { MatchCriteria } from '@/types';

// Kriteria terakhir yang dipakai pengguna. Disimpan di memori modul, sama
// seperti favorites.service.ts; ganti ke AsyncStorage kalau harus bertahan
// setelah aplikasi ditutup.
let savedCriteria: MatchCriteria = { ...mockCriteria, cravings: [...mockCriteria.cravings] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToCriteria(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCriteriaSnapshot(): MatchCriteria {
  return savedCriteria;
}

export function saveCriteria(next: MatchCriteria): void {
  savedCriteria = { ...next, cravings: [...next.cravings] };
  emit();
}
