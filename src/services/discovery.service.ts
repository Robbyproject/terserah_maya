import { API_BASE_URL } from '@/constants/config';
import { apiGet } from '@/lib/api';
import { matchesCriteria } from '@/lib/match';
import { simulateNetwork } from '@/mocks/delay';
import { mockRestaurants } from '@/mocks/restaurants';
import { mockSponsors } from '@/mocks/sponsors';
import type { MatchCriteria, Restaurant, Sponsor } from '@/types';

export function getSponsors(): Promise<Sponsor[]> {
  return simulateNetwork(mockSponsors, 450);
}

const NEARBY_PICKS_LIMIT = 3;

export function getNearbyPicks(): Promise<Restaurant[]> {
  return simulateNetwork(mockRestaurants.slice(0, NEARBY_PICKS_LIMIT), 700);
}

// Contract: GET /restaurants -> Restaurant[] as defined in src/types/restaurant.ts
// (id, name, category, description, imageUrl, rating, price {min,max}, distanceKm,
// optional address, closesAt, topPick, budgetTier; topPick shows the "Terfavorit" badge).
// TODO: confirm endpoint with the backend.
export function getAllPicks(): Promise<Restaurant[]> {
  // One switch point: real database when configured, dummy data otherwise.
  if (API_BASE_URL) {
    return apiGet<Restaurant[]>('/restaurants');
  }

  return simulateNetwork(mockRestaurants, 700);
}

export function spinForMatch(criteria: MatchCriteria): Promise<Restaurant> {
  const candidates = mockRestaurants.filter((restaurant) => matchesCriteria(restaurant, criteria));
  const pool = candidates.length > 0 ? candidates : mockRestaurants;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return simulateNetwork(pick, 900);
}
