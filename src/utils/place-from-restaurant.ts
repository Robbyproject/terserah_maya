import type { Restaurant } from '@/types';
import type { OpeningHoursDay, Place, TravelOption } from '@/types/place';

/**
 * Adapter Restaurant (data discovery/match) -> Place (tampilan detail restoran).
 *
 * Beberapa field Place belum ada di Restaurant (jumlah ulasan, jam buka per hari,
 * telepon, website). Untuk sekarang diturunkan dari data mock yang ada supaya sheet
 * bisa langsung terisi. Saat adapter Google Places/Routes masuk, fungsi ini yang
 * dibuang / diganti.
 */

const DAY_LABELS = [
  { day: 1, label: 'Senin' },
  { day: 2, label: 'Selasa' },
  { day: 3, label: 'Rabu' },
  { day: 4, label: 'Kamis' },
  { day: 5, label: 'Jumat' },
  { day: 6, label: 'Sabtu' },
  { day: 0, label: 'Minggu' },
] as const;

/** Batas harga (Rupiah) untuk tiap level $ s/d $$$$. */
const PRICE_LEVEL_MAX: readonly (readonly [number, 1 | 2 | 3 | 4])[] = [
  [30_000, 1],
  [60_000, 2],
  [100_000, 3],
  [Number.POSITIVE_INFINITY, 4],
];

function toPriceLevel(price: Restaurant['price']): Place['priceLevel'] {
  if (!price) return 2;
  const level = PRICE_LEVEL_MAX.find(([max]) => price.max <= max)?.[1];
  return level ?? 4;
}

/**
 * Jumlah ulasan placeholder yang stabil per restoran (angka yang sama tiap render
 * dan tiap dibuka) biar header detail ga menampilkan "(0)".
 */
function toReviewCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 80 + (hash % 2400);
}

function toHoursByDay(closesAt?: string): OpeningHoursDay[] {
  if (!closesAt) return [];
  const hours = `10:00 - ${closesAt}`;
  return DAY_LABELS.map((day) => ({ ...day, hours }));
}

/** Estimasi perjalanan dari jarak datar (mock) — nanti diganti Routes API. */
function toTravel(distanceKm: number): TravelOption[] {
  const distanceMeters = Math.round(distanceKm * 1000);
  const minutes = (kmPerHour: number, extra = 0) => Math.round((distanceKm / kmPerHour) * 60 + extra);

  return [
    { mode: 'drive', durationMinutes: minutes(20), distanceMeters },
    { mode: 'two_wheeler', durationMinutes: minutes(25), distanceMeters },
    { mode: 'transit', durationMinutes: minutes(15, 5), distanceMeters },
    { mode: 'walk', durationMinutes: minutes(4.8), distanceMeters },
  ];
}

export function restaurantToPlace(restaurant: Restaurant): Place {
  const { closesAt } = restaurant;

  return {
    id: restaurant.id,
    name: restaurant.name,
    category: restaurant.category,
    rating: restaurant.rating ?? 0,
    reviewCount: restaurant.reviewCount ?? toReviewCount(restaurant.id),
    priceLevel: toPriceLevel(restaurant.price),
    address: restaurant.address ?? 'Alamat belum tersedia',
    photos: restaurant.imageUrl
      ? [{ uri: restaurant.imageUrl, attribution: 'Google Maps' }]
      : [],
    isOpenNow: restaurant.isOpenNow ?? true,
    statusText: closesAt ? `Buka sampai ${closesAt}` : 'Buka hari ini',
    hoursByDay: toHoursByDay(closesAt),
    travel: toTravel(restaurant.distanceKm),
    phone: restaurant.phone,
    website: restaurant.website,
  };
}
