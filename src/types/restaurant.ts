import type { BudgetTier } from './criteria';

export type PriceRange = {
  min: number;
  max: number;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  price: PriceRange;
  distanceKm: number;
  address?: string;
  closesAt?: string;
  topPick?: boolean;
  budgetTier?: BudgetTier;
};
