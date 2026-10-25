import { API_BASE_URL } from '@/constants/config';
import { apiGet, apiPost } from '@/lib/api';
import { matchesCriteria } from '@/lib/match';
import { simulateNetwork } from '@/mocks/delay';
import { mockRestaurants } from '@/mocks/restaurants';
import { mockSponsors } from '@/mocks/sponsors';
import type { MatchCriteria, MatchResult, Restaurant, Sponsor } from '@/types';
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

function mockMatchResult(criteria: MatchCriteria): MatchResult {
  const matched = mockRestaurants.filter((restaurant) => matchesCriteria(restaurant, criteria));
  const candidates = matched.length > 0 ? matched : mockRestaurants;
  const match = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    match,
    candidates,
    poolSize: candidates.length,
    totalNearby: mockRestaurants.length,
    relaxed: [],
  };
}

// Radius match diambil dari kriteria di sheet (1/3/8 km), bukan radius lokasi
// aktif — backend menerima `criteria.distance` dan memutuskan sendiri.
export async function spinForMatch(criteria: MatchCriteria): Promise<MatchResult> {
  if (!API_BASE_URL) {
    return simulateNetwork(mockMatchResult(criteria), 900);
  }

  const location = await getActiveLocation();

  return apiPost<MatchResult>('/api/restaurants/match', {
    lat: location.latitude,
    lng: location.longitude,
    criteria,
  });
}
