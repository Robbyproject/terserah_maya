/**
 * Bentuk data restoran versi aplikasi (bukan bentuk mentah dari Google).
 * Nanti dibuat adapter: respons Places API / Routes API -> Place.
 */

export type TravelModeId = 'drive' | 'two_wheeler' | 'transit' | 'walk';

export type TravelOption = {
  mode: TravelModeId;
  durationMinutes: number;
  distanceMeters: number;
  /** Ringkasan opsional, mis. "KRL Bekasi → Gondangdia" */
  summary?: string;
};

export type OpeningHoursDay = {
  /** 0 = Minggu ... 6 = Sabtu (sama dengan Date.getDay()) */
  day: number;
  /** Nama hari untuk ditampilkan, mis. "Senin" */
  label: string;
  /** Teks jam, mis. "10:00 - 22:00" atau "Tutup" */
  hours: string;
};

export type PlacePhoto = {
  uri: string;
  /** Nama penulis foto, wajib ditampilkan sesuai aturan atribusi Google */
  attribution?: string;
};

export type Place = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  /** 1-4, tampil sebagai $ sampai $$$$ */
  priceLevel?: 1 | 2 | 3 | 4;
  address: string;
  photos: PlacePhoto[];
  isOpenNow: boolean;
  /** Teks status siap tampil, mis. "Buka sampai 22:00" */
  statusText: string;
  hoursByDay: OpeningHoursDay[];
  /** Estimasi dari lokasi user saat ini */
  travel: TravelOption[];
  phone?: string;
  website?: string;
};