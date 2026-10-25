import type { BudgetTier } from './criteria';

export type PriceRange = {
  min: number;
  max: number;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  price?: PriceRange;
  distanceKm: number;
  address?: string;
  closesAt?: string;
  isOpenNow?: boolean;
  phone?: string;
  website?: string;
  topPick?: boolean;
  budgetTier?: BudgetTier;
};
