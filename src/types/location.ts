export type LocationSource = 'device' | 'manual';

export type UserLocation = {
  id: string;
  /** Sedetail mungkin: nama jalan (dengan nomor kalau ada). */
  label: string;
  /** Lingkup yang lebih luas (kecamatan/kota) untuk baris kedua di sheet. */
  areaLabel?: string;
  radiusKm: number;
  latitude: number;
  longitude: number;
  /** `device` = fix GPS asli, `manual` = area yang diketik pengguna. */
  source?: LocationSource;
  /** Radius ketidakpastian fix GPS dalam meter (null kalau tidak diketahui). */
  accuracyM?: number | null;
  /** false = izin hanya "perkiraan" (Android coarse / iOS reduced) atau fix kasar. */
  precise?: boolean;
};
