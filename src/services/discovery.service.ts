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

export function getAllPicks(): Promise<Restaurant[]> {
  return simulateNetwork(mockRestaurants, 700);
}

export function spinForMatch(criteria: MatchCriteria): Promise<Restaurant> {
  const candidates = mockRestaurants.filter((restaurant) => matchesCriteria(restaurant, criteria));
  const pool = candidates.length > 0 ? candidates : mockRestaurants;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return simulateNetwork(pick, 900);
}
