import { simulateNetwork } from '@/mocks/delay';
import { mockUser } from '@/mocks/user';
import type { User } from '@/types';

export function getCurrentUser(): Promise<User> {
  return simulateNetwork(mockUser, 450);
}
