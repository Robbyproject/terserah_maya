import { API_BASE_URL } from '@/constants/config';
import { apiGet } from '@/lib/api';
import { matchesCriteria } from '@/lib/match';
import { simulateNetwork } from '@/mocks/delay';
import { mockRestaurants } from '@/mocks/restaurants';
import { mockSponsors } from '@/mocks/sponsors';
import type { MatchCriteria, Restaurant, Sponsor } from '@/types';
import { getActiveLocation } from './location.service';

const NEARBY_PICKS_LIMIT = 3;

export async function getSponsors(): Promise<Sponsor[]> {
  if (!API_BASE_URL) {
    return simulateNetwork(mockSponsors, 450);
  }

  try {
    return await apiGet<Sponsor[]>('/api/sponsors');
  } catch {
    // Carousel sponsor tidak punya state error; kalau backend mati, tampilkan
    // promo bawaan daripada skeleton yang menggantung selamanya.
    return mockSponsors;
  }
}

function nearbyPath(location: Awaited<ReturnType<typeof getActiveLocation>>): string {
  const radius = Math.round(location.radiusKm * 1000);
  return `/api/restaurants/nearby?lat=${location.latitude}&lng=${location.longitude}&radius=${radius}`;
}

export async function getNearbyPicks(): Promise<Restaurant[]> {
  if (!API_BASE_URL) {
    return simulateNetwork(mockRestaurants.slice(0, NEARBY_PICKS_LIMIT), 700);
  }

  const location = await getActiveLocation();
  const restaurants = await apiGet<Restaurant[]>(nearbyPath(location));

  return restaurants.slice(0, NEARBY_PICKS_LIMIT);
}

// Daftar lengkap untuk halaman /favorites. Bukan katalog global: Google Places
// mengembalikan maksimal 20 hasil di sekitar lokasi aktif.
export async function getAllPicks(): Promise<Restaurant[]> {
  if (!API_BASE_URL) {
    return simulateNetwork(mockRestaurants, 700);
  }

  const location = await getActiveLocation();

  return apiGet<Restaurant[]>(nearbyPath(location));
}

export function spinForMatch(criteria: MatchCriteria): Promise<Restaurant> {
  const candidates = mockRestaurants.filter((restaurant) => matchesCriteria(restaurant, criteria));
  const pool = candidates.length > 0 ? candidates : mockRestaurants;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return simulateNetwork(pick, 900);
}
