import { simulateNetwork } from '@/mocks/delay';
import { mockLocation } from '@/mocks/location';
import type { UserLocation } from '@/types';

export function getActiveLocation(): Promise<UserLocation> {
  return simulateNetwork(mockLocation, 450);
}
