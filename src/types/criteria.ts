import type { Restaurant } from './restaurant';

export type BudgetTier = 'hemat' | 'pas' | 'nraktir' | 'sultan';

export type Distance = '1km' | '3km' | '8km';

export type MinRating = 'all' | '4.0' | '4.5';

// Key stabil untuk dikirim ke backend; label tampilan ada di constants/match.ts.
export type CravingKey =
  | 'bebas'
  | 'bakso_mie'
  | 'nasi_padang'
  | 'ayam_geprek'
  | 'sate_street'
  | 'kopi_snack';

export type RelaxedCriterion = 'craving' | 'budget' | 'rating';

export type MatchCriteria = {
  budgetTier: BudgetTier;
  cravings: CravingKey[];
  distance: Distance;
  minRating: MinRating;
};

export type CravingOption = {
  key: CravingKey;
  label: string;
};

export type MatchResult = {
  match: Restaurant;
  candidates: Restaurant[];
  poolSize: number;
  totalNearby: number;
  relaxed: RelaxedCriterion[];
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
