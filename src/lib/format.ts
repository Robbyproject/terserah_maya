import type { PriceRange } from '@/types';

export function formatPrice(value: number): string {
  return `${Math.round(value / 1000)}k`;
}

export function formatPriceRange(price: PriceRange): string {
  return `Rp ${formatPrice(price.min)} - ${formatPrice(price.max)}`;
}

export function formatDistance(distanceKm: number): string {
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`;
}

// Radius ketidakpastian GPS: 8 -> "±8 m", 1800 -> "±1.8 km".
export function formatAccuracy(accuracyM: number): string {
  if (accuracyM < 1000) return `±${Math.round(accuracyM)} m`;

  return `±${(accuracyM / 1000).toFixed(1)} km`;
}
