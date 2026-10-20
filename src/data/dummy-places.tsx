import type { Place } from '@/types/place';

/** DATA DUMMY untuk pengembangan UI. Ganti dengan adapter Google Places/Routes. */
export const DUMMY_PLACE: Place = {
  id: 'dummy-bakmi-gondangdia',
  name: 'Bakmi Gondangdia 1968',
  category: 'Noodles',
  rating: 4.7,
  reviewCount: 2100,
  priceLevel: 2,
  address: 'Jl. Gondangdia Lama, Menteng, Jakarta Pusat',
  photos: [],
  isOpenNow: true,
  statusText: 'Buka sampai 22:00',
  hoursByDay: [
    { day: 1, label: 'Senin', hours: '10:00 - 22:00' },
    { day: 2, label: 'Selasa', hours: '10:00 - 22:00' },
    { day: 3, label: 'Rabu', hours: '10:00 - 22:00' },
    { day: 4, label: 'Kamis', hours: '10:00 - 22:00' },
    { day: 5, label: 'Jumat', hours: '10:00 - 22:00' },
    { day: 6, label: 'Sabtu', hours: '10:00 - 22:00' },
    { day: 0, label: 'Minggu', hours: '10:00 - 22:00' },
  ],
  travel: [
    { mode: 'drive', durationMinutes: 55, distanceMeters: 24000 },
    { mode: 'two_wheeler', durationMinutes: 40, distanceMeters: 22000 },
    { mode: 'transit', durationMinutes: 70, distanceMeters: 23000, summary: 'KRL Bekasi → Gondangdia' },
    { mode: 'walk', durationMinutes: 280, distanceMeters: 23000 },
  ],
  phone: '+62 21 0000 0000',
  website: 'https://example.com',
};

/** Daftar dummy untuk mengetes "Cari Lain" (bergantian antar restoran). */
export const DUMMY_PLACES: Place[] = [
  DUMMY_PLACE,
  {
    ...DUMMY_PLACE,
    id: 'dummy-gultik-mahakam',
    name: 'Gultik Mahakam Blok M',
    category: 'Street Food',
    rating: 4.8,
    reviewCount: 980,
    priceLevel: 1,
    address: 'Jl. Mahakam, Melawai, Jakarta Selatan',
  },
];