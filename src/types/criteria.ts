export type BudgetTier = 'hemat' | 'pas' | 'nraktir' | 'sultan';

export type Distance = '1km' | '3km' | '8km';

export type MinRating = 'all' | '4.0' | '4.5';

export type MatchCriteria = {
  budgetTier: BudgetTier;
  cravings: string[];
  distance: Distance;
  minRating: MinRating;
};

export type BudgetOption = {
  tier: BudgetTier;
  label: string;
  range: string;
  caption: string;
  symbol: string;
  emoji: string;
  moodLabel: string;
  minPrice: number;
  maxPrice: number;
  favorite?: boolean;
};

export type DistanceOption = {
  value: Distance;
  label: string;
  display: string;
  summary: string;
  radiusKm: number;
};

export type RatingOption = {
  value: MinRating;
  label: string;
  display: string;
  minRating: number;
};
