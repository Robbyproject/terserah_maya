import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

import { API_BASE_URL } from '@/constants/config';
import { apiGet } from '@/lib/api';
import { simulateNetwork } from '@/mocks/delay';
import { mockLocation } from '@/mocks/location';
import type { UserLocation } from '@/types';

export const DEFAULT_RADIUS_KM = 3;

const FIX_TIMEOUT_MS = 12_000;
const FRESH_FIX_MAX_AGE_MS = 60_000;
const FRESH_FIX_ACCURACY_M = 30;
const STALE_FIX_MAX_AGE_MS = 10 * 60_000;
const STALE_FIX_ACCURACY_M = 200;
const COARSE_ACCURACY_M = 100;
const REFINE_TRIGGER_ACCURACY_M = 50;
const REFINE_TARGET_ACCURACY_M = 20;
const REFINE_SAMPLES = 2;
const REFINE_BUDGET_MS = 6000;

type ResolvedLabel = { label: string; areaLabel?: string };

export type LocationFailure =
  | 'permission_denied'
  | 'permission_blocked'
  | 'services_off'
  | 'timeout';

// Kegagalan lokasi yang bisa ditindaklanjuti UI (tombol Pengaturan, coba lagi,
// dsb). Pesannya sudah siap tampil ke pengguna.
export class LocationError extends Error {
  readonly reason: LocationFailure;

  constructor(reason: LocationFailure, message: string) {
    super(message);
    this.name = 'LocationError';
    this.reason = reason;
  }
}

export function isLocationError(cause: unknown): cause is LocationError {
  return cause instanceof LocationError;
}

// Mode mock (tanpa EXPO_PUBLIC_API_BASE_URL) memakai Menteng supaya dev offline
// tetap jalan. Mode live tidak pernah mengarang koordinat: kalau tidak ada fix,
// pemanggil menerima LocationError.
let activeLocationState: UserLocation | null = API_BASE_URL ? null : { ...mockLocation };
let pendingLocation: Promise<UserLocation> | null = null;

function locationId(latitude: number, longitude: number): string {
  return `loc_${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
}

function hasCoords(
  value: Partial<UserLocation>
): value is Pick<UserLocation, 'latitude' | 'longitude'> {
  return typeof value.latitude === 'number' && typeof value.longitude === 'number';
}

function withTimeout<T>(promise: Promise<T>, ms: number, makeError: () => Error): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(makeError()), ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

// getCurrentPositionAsync tidak punya opsi timeout, dan di web penolakan izin
// muncul sebagai GeolocationPositionError (code 1) yang bukan Error biasa.
function toLocationError(cause: unknown): LocationError {
  if (isLocationError(cause)) return cause;

  const code = (cause as { code?: unknown } | null)?.code;
  const message = cause instanceof Error ? cause.message.toLowerCase() : '';

  if (code === 1 || message.includes('denied') || message.includes('permission')) {
    return new LocationError('permission_denied', PERMISSION_DENIED_MESSAGE);
  }

  return new LocationError('timeout', FIX_FAILED_MESSAGE);
}

const PERMISSION_DENIED_MESSAGE =
  'Izin lokasi ditolak. Aplikasi butuh lokasi untuk mencari tempat makan di sekitarmu.';
const PERMISSION_BLOCKED_MESSAGE =
  'Izin lokasi diblokir. Aktifkan lewat Pengaturan supaya lokasimu terdeteksi.';
const FIX_FAILED_MESSAGE = 'Belum dapat lokasi. Coba di area terbuka atau nyalakan GPS.';

async function ensurePermission(): Promise<{ precise: boolean }> {
  // Di web, Permissions API bisa melaporkan "prompt" tanpa pernah menampilkan
  // dialog. Panggilan getCurrentPositionAsync-lah yang memicu prompt browser,
  // jadi jangan diputus di sini; penolakan ditangani lewat toLocationError.
  if (Platform.OS === 'web') return { precise: true };

  let permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    if (!permission.canAskAgain) {
      throw new LocationError('permission_blocked', PERMISSION_BLOCKED_MESSAGE);
    }

    permission = await Location.requestForegroundPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    throw new LocationError(
      permission.canAskAgain ? 'permission_denied' : 'permission_blocked',
      permission.canAskAgain ? PERMISSION_DENIED_MESSAGE : PERMISSION_BLOCKED_MESSAGE
    );
  }

  // Android 12+ dan iOS 14+ mengizinkan "perkiraan saja"; hasilnya bisa meleset
  // kilometer. Di web tidak ada flag ini, jadi pakai coords.accuracy saja.
  const precise =
    Platform.OS === 'android'
      ? permission.android?.accuracy !== 'coarse'
      : Platform.OS === 'ios'
        ? permission.ios?.accuracy !== 'reduced'
        : true;

  return { precise };
}

async function ensureServices(): Promise<void> {
  try {
    const enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      throw new LocationError(
        'services_off',
        'Lokasi di perangkat sedang mati. Nyalakan GPS dulu ya.'
      );
    }
  } catch (cause) {
    if (isLocationError(cause)) throw cause;
    // Web / lingkungan tanpa provider: biarkan pembacaan posisi yang melapor.
  }
}

async function lastKnownPosition(maxAge: number, requiredAccuracy: number) {
  try {
    return await Location.getLastKnownPositionAsync({ maxAge, requiredAccuracy });
  } catch {
    return null;
  }
}

function accuracyOf(position: Location.LocationObject): number {
  const accuracy = position.coords.accuracy;
  return typeof accuracy === 'number' ? accuracy : Number.POSITIVE_INFINITY;
}

// Kalau fix pertama masih kasar, ambil beberapa sampel lagi dan simpan yang
// paling tajam. Dibatasi waktu supaya tidak terasa menggantung.
async function refineFix(position: Location.LocationObject): Promise<Location.LocationObject> {
  // Browser tidak punya kontrol akurasi seperti ini; jangan menambah latensi.
  if (Platform.OS === 'web') return position;

  let best = position;
  const deadline = Date.now() + REFINE_BUDGET_MS;

  for (let sample = 0; sample < REFINE_SAMPLES; sample += 1) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;

    try {
      const next = await withTimeout(
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
        remaining,
        () => new LocationError('timeout', FIX_FAILED_MESSAGE)
      );

      if (accuracyOf(next) < accuracyOf(best)) best = next;
      if (accuracyOf(best) <= REFINE_TARGET_ACCURACY_M) break;
    } catch {
      break;
    }
  }

  return best;
}

// Fix terakhir yang masih segar dan cukup tajam dipakai lebih dulu (docs
// menyarankan ini agar tidak menunggu GPS). Kalau tidak ada, ambil fix asli
// dengan akurasi High (~10 m) dan pertajam bila masih kasar. Kalau itu gagal,
// terima fix lama yang kasar daripada menggantung; accuracyM akan menandainya.
async function readFix(): Promise<Location.LocationObject> {
  const fresh = await lastKnownPosition(FRESH_FIX_MAX_AGE_MS, FRESH_FIX_ACCURACY_M);
  if (fresh) return fresh;

  try {
    const precise = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      FIX_TIMEOUT_MS,
      () => new LocationError('timeout', FIX_FAILED_MESSAGE)
    );

    return accuracyOf(precise) > REFINE_TRIGGER_ACCURACY_M ? refineFix(precise) : precise;
  } catch (cause) {
    const stale = await lastKnownPosition(STALE_FIX_MAX_AGE_MS, STALE_FIX_ACCURACY_M);
    if (stale) return stale;

    throw toLocationError(cause);
  }
}

// Nama jalan + nomor kalau ada; kalau tidak, tempat/lingkungan terdekat.
// `areaLabel` menyimpan lingkup yang lebih luas untuk baris kedua di sheet.
function labelFromAddress(
  address?: Location.LocationGeocodedAddress
): ResolvedLabel | null {
  if (!address) return null;

  const street = address.street
    ? address.streetNumber
      ? `${address.street} No. ${address.streetNumber}`
      : address.street
    : null;

  const label = street ?? address.name ?? address.district ?? address.subregion ?? address.city;

  if (!label) return null;

  const area = [address.district, address.city]
    .filter((part): part is string => Boolean(part) && part !== label)
    .join(', ');

  return area ? { label, areaLabel: area } : { label };
}

async function readDeviceLabel(
  coords: Pick<UserLocation, 'latitude' | 'longitude'>
): Promise<ResolvedLabel | null> {
  // Reverse geocoding perangkat tidak tersedia di web.
  if (Platform.OS === 'web') return null;

  try {
    const [address] = await Location.reverseGeocodeAsync(coords);
    return labelFromAddress(address);
  } catch {
    return null;
  }
}

// Geocoding hanya untuk label. Kegagalannya tidak boleh menggeser atau
// membatalkan koordinat yang sudah valid.
//
// Geocoder perangkat dicoba lebih dulu: di Android itu data Google, yang jauh
// lebih rapat untuk nama jalan Indonesia daripada OpenStreetMap.
async function labelFor(
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<ResolvedLabel> {
  const deviceLabel = await readDeviceLabel({ latitude, longitude });
  if (deviceLabel) return deviceLabel;

  if (API_BASE_URL) {
    try {
      const remote = await apiGet<Partial<UserLocation>>(
        `/api/location/reverse?lat=${latitude}&lng=${longitude}&radiusKm=${radiusKm}`
      );

      if (remote?.label) {
        return { label: remote.label, areaLabel: remote.areaLabel };
      }
    } catch {
      // Label gagal diambil bukan alasan untuk membuang koordinat yang valid.
    }
  }

  return { label: 'Lokasi saat ini' };
}

// Fix GPS sekali jalan, tanpa menyentuh state modul. Dipakai sheet "Ubah Lokasi"
// untuk pratinjau sebelum pengguna menekan "Pakai Lokasi Sekarang".
export async function resolveDeviceLocation(
  radiusKm: number = DEFAULT_RADIUS_KM
): Promise<UserLocation> {
  if (!API_BASE_URL) {
    return simulateNetwork({ ...mockLocation, radiusKm }, 300);
  }

  const { precise } = await ensurePermission();
  await ensureServices();

  const position = await readFix();
  const { latitude, longitude, accuracy } = position.coords;
  const accuracyM = typeof accuracy === 'number' ? Math.round(accuracy) : null;
  const labels = await labelFor(latitude, longitude, radiusKm);

  return {
    id: locationId(latitude, longitude),
    label: labels.label,
    areaLabel: labels.areaLabel,
    radiusKm,
    latitude,
    longitude,
    source: 'device',
    accuracyM,
    precise: precise && (accuracyM === null || accuracyM <= COARSE_ACCURACY_M),
  };
}

export function getActiveLocation(): Promise<UserLocation> {
  if (!API_BASE_URL) {
    return simulateNetwork(activeLocationState ?? { ...mockLocation }, 300);
  }

  // Area yang dipilih pengguna menang atas GPS sampai di-refresh.
  if (activeLocationState) return Promise.resolve(activeLocationState);

  if (!pendingLocation) {
    pendingLocation = resolveDeviceLocation().then(
      (location) => {
        activeLocationState = location;
        return location;
      },
      (cause: unknown) => {
        // Jangan simpan kegagalan, supaya percobaan berikutnya bisa jalan.
        pendingLocation = null;
        throw cause;
      }
    );
  }

  return pendingLocation;
}

// Fix ulang (pull-to-refresh). Kalau gagal, lokasi lama tetap dipakai.
export async function refreshActiveLocation(radiusKm?: number): Promise<UserLocation> {
  if (!API_BASE_URL) {
    return simulateNetwork(activeLocationState ?? { ...mockLocation }, 300);
  }

  const radius = radiusKm ?? activeLocationState?.radiusKm ?? DEFAULT_RADIUS_KM;

  pendingLocation = null;

  const location = await resolveDeviceLocation(radius);
  activeLocationState = location;

  return location;
}

export function saveActiveLocation(newLocation: UserLocation): Promise<UserLocation> {
  activeLocationState = { ...newLocation };
  pendingLocation = null;

  return simulateNetwork(activeLocationState, 300);
}

// Area yang diketik pengguna: centroid hasil geocoder, bukan posisi saat ini.
export async function resolveAreaLabel(
  query: string,
  radiusKm: number
): Promise<UserLocation> {
  const trimmed = query.trim();

  if (!API_BASE_URL) {
    return simulateNetwork(
      { ...mockLocation, label: trimmed, radiusKm, source: 'manual' },
      300
    );
  }

  try {
    const resolved = await apiGet<UserLocation>(
      `/api/location/resolve?q=${encodeURIComponent(trimmed)}&radiusKm=${radiusKm}`
    );

    if (!hasCoords(resolved)) {
      throw new Error('Backend tidak mengirim koordinat lokasi.');
    }

    return { ...resolved, source: 'manual' };
  } catch (cause) {
    // Backend tidak bisa geocode (billing/key); coba geocoder perangkat dulu.
    const coords = await geocodeOnDevice(trimmed);

    if (!coords) throw cause;

    return {
      id: locationId(coords.latitude, coords.longitude),
      label: trimmed,
      radiusKm,
      ...coords,
      source: 'manual',
    };
  }
}

export async function openAppSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // Platform tanpa halaman pengaturan (mis. web): tidak ada yang bisa dibuka.
  }
}

async function geocodeOnDevice(
  query: string
): Promise<Pick<UserLocation, 'latitude' | 'longitude'> | null> {
  if (Platform.OS === 'web') return null;

  try {
    const [result] = await Location.geocodeAsync(query);

    return result ? { latitude: result.latitude, longitude: result.longitude } : null;
  } catch {
    return null;
  }
}
