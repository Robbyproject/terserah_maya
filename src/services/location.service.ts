import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { API_BASE_URL } from '@/constants/config';
import { apiGet } from '@/lib/api';
import { simulateNetwork } from '@/mocks/delay';
import { mockLocation } from '@/mocks/location';
import type { UserLocation } from '@/types';

let activeLocationState: UserLocation = { ...mockLocation };
let locationResolved = false;
let pendingLocation: Promise<UserLocation> | null = null;

// Tanpa koordinat, /nearby akan dipanggil dengan lat=undefined dan ditolak 400.
// Jangan pernah menyimpan lokasi yang tidak lengkap.
function hasCoords(
  value: Partial<UserLocation>
): value is Pick<UserLocation, 'latitude' | 'longitude'> {
  return typeof value.latitude === 'number' && typeof value.longitude === 'number';
}

async function readDeviceCoords(): Promise<Pick<UserLocation, 'latitude' | 'longitude'>> {
  const fallback = { latitude: mockLocation.latitude, longitude: mockLocation.longitude };

  // Static prerender (expo export --platform web) berjalan di Node; jangan pernah
  // menyentuh expo-location di sana.
  if (Platform.OS === 'web') return fallback;

  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      return fallback;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return fallback;
  }
}

function labelFromAddress(address?: Location.LocationGeocodedAddress): string | null {
  if (!address) return null;

  const area = address.district ?? address.subregion ?? address.name;
  const city = address.city;

  if (area && city && area !== city) return `${area}, ${city}`;

  return area ?? city ?? null;
}

// Cadangan saat Google Geocoding menolak (mis. billing belum aktif): pakai
// geocoder bawaan perangkat, yang tidak butuh API key.
async function readDeviceLabel(
  coords: Pick<UserLocation, 'latitude' | 'longitude'>
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const [address] = await Location.reverseGeocodeAsync(coords);
    return labelFromAddress(address);
  } catch {
    return null;
  }
}

async function resolveActiveLocation(): Promise<UserLocation> {
  if (locationResolved) return activeLocationState;

  const coords = await readDeviceCoords();

  try {
    const remote = await apiGet<Partial<UserLocation>>(
      `/api/location/reverse?lat=${coords.latitude}&lng=${coords.longitude}&radiusKm=${activeLocationState.radiusKm}`
    );

    activeLocationState = {
      ...activeLocationState,
      ...remote,
      latitude: hasCoords(remote) ? remote.latitude : coords.latitude,
      longitude: hasCoords(remote) ? remote.longitude : coords.longitude,
    };
  } catch {
    const deviceLabel = await readDeviceLabel(coords);

    activeLocationState = {
      ...activeLocationState,
      ...coords,
      ...(deviceLabel ? { label: deviceLabel } : {}),
    };
  }

  locationResolved = true;

  return activeLocationState;
}

export function getActiveLocation(): Promise<UserLocation> {
  if (!API_BASE_URL) {
    return simulateNetwork(activeLocationState, 450);
  }

  // Satu promise dipakai bersama oleh location pill dan pencarian restoran,
  // supaya keduanya tidak pernah memakai koordinat yang berbeda.
  if (!pendingLocation) {
    pendingLocation = resolveActiveLocation();
  }

  return pendingLocation;
}

export function saveActiveLocation(newLocation: UserLocation): Promise<UserLocation> {
  activeLocationState = { ...newLocation };
  locationResolved = true;
  pendingLocation = null;

  return simulateNetwork(activeLocationState, 300);
}

export async function resolveLocationLabel(
  label: string,
  radiusKm: number
): Promise<UserLocation> {
  const query = label.trim();

  if (!API_BASE_URL) {
    return simulateNetwork({ ...activeLocationState, label: query, radiusKm }, 300);
  }

  try {
    const resolved = await apiGet<UserLocation>(
      `/api/location/resolve?q=${encodeURIComponent(query)}&radiusKm=${radiusKm}`
    );

    if (!hasCoords(resolved)) {
      throw new Error('Backend tidak mengirim koordinat lokasi.');
    }

    return resolved;
  } catch (cause) {
    // Backend tidak bisa geocode (billing/key); coba geocoder perangkat dulu.
    const coords = await geocodeOnDevice(query);

    if (!coords) throw cause;

    return {
      id: `loc_${coords.latitude.toFixed(4)}_${coords.longitude.toFixed(4)}`,
      label: query,
      radiusKm,
      ...coords,
    };
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
