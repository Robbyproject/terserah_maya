import { simulateNetwork } from '@/mocks/delay';
import { mockLocation } from '@/mocks/location';
import type { UserLocation } from '@/types';

// Menyimpan state lokasi sementara di memori
let activeLocationState: UserLocation = { ...mockLocation };

export function getActiveLocation(): Promise<UserLocation> {
  return simulateNetwork(activeLocationState, 450);
}

export function saveActiveLocation(newLocation: UserLocation): Promise<UserLocation> {
  activeLocationState = { ...newLocation };
  return simulateNetwork(activeLocationState, 300);
}