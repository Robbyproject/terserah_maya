import { BUDGET_TIERS, DISTANCE_OPTIONS, RATING_OPTIONS } from '@/constants/match';
import type { MatchCriteria, Restaurant } from '@/types';

export function describeCriteria(criteria: MatchCriteria): string {
  const budget = BUDGET_TIERS.find((option) => option.tier === criteria.budgetTier);
  const distance = DISTANCE_OPTIONS.find((option) => option.value === criteria.distance);
  const rating = RATING_OPTIONS.find((option) => option.value === criteria.minRating);

  return [budget?.range, distance?.summary, rating?.display]
    .filter((part): part is string => part !== undefined)
    .join(' • ');
}

export function matchesCriteria(restaurant: Restaurant, criteria: MatchCriteria): boolean {
  const budget = BUDGET_TIERS.find((option) => option.tier === criteria.budgetTier);
  const distance = DISTANCE_OPTIONS.find((option) => option.value === criteria.distance);
  const rating = RATING_OPTIONS.find((option) => option.value === criteria.minRating);

  const withinBudget =
    budget && restaurant.price
      ? restaurant.price.min <= budget.maxPrice && restaurant.price.max >= budget.minPrice
      : true;
  const withinDistance = distance ? restaurant.distanceKm <= distance.radiusKm : true;
  const withinRating =
    rating && restaurant.rating != null ? restaurant.rating >= rating.minRating : true;

  return withinBudget && withinDistance && withinRating;
}
