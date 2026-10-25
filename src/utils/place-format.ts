import type { TravelOption } from '@/types/place';

/** 45 -> "45 mnt", 80 -> "1 j 20 mnt", 120 -> "2 j" */
export function formatDuration(minutes: number): string {
  const total = Math.max(1, Math.round(minutes));
  if (total < 60) return `${total} mnt`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} j` : `${h} j ${m} mnt`;
}

/** 850 -> "850 m", 1200 -> "1,2 km", 24000 -> "24 km" */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1).replace('.', ',')} km` : `${Math.round(km)} km`;
}

/** 980 -> "980", 2100 -> "2,1 rb" */
export function formatReviewCount(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1).replace('.', ',')} rb` : String(count);
}

export function getFastestTravel(options: TravelOption[]): TravelOption | undefined {
  return options.reduce<TravelOption | undefined>(
    (best, option) => (!best || option.durationMinutes < best.durationMinutes ? option : best),
    undefined
  );
}

/** Jarak yang ditampilkan di header: pakai jarak mobil, fallback ke moda tercepat. */
export function getDisplayDistance(options: TravelOption[]): number | undefined {
  return (options.find((o) => o.mode === 'drive') ?? getFastestTravel(options))?.distanceMeters;
}