import { useSyncExternalStore } from 'react';

import {
  getFavoritesSnapshot,
  subscribeToFavorites,
  toggleFavorite,
} from '@/services/favorites.service';

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getFavoritesSnapshot,
  );

  return {
    favoriteIds,
    isFavorite: (id: string) => favoriteIds.includes(id),
    toggleFavorite,
  };
}
