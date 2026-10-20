import { simulateNetwork } from '@/mocks/delay';
import { mockProfile } from '@/constants/profile';
import type { User } from '@/types';

export function getCurrentUser(): Promise<User> {
  return simulateNetwork(mockProfile, 450);
}
