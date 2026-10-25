import { mockFavoriteIds } from '@/mocks/favorites';

let favoriteIds: string[] = [...mockFavoriteIds];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToFavorites(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getFavoritesSnapshot(): string[] {
  return favoriteIds;
}

export function toggleFavorite(id: string): void {
  favoriteIds = favoriteIds.includes(id)
    ? favoriteIds.filter((value) => value !== id)
    : [...favoriteIds, id];

  emit();
}
