import { API_BASE_URL, DEMO_USER_ID } from '@/constants/config';
import { apiGet } from '@/lib/api';
import { simulateNetwork } from '@/mocks/delay';
import { mockProfile } from '@/constants/profile';
import type { User } from '@/types';

export async function getCurrentUser(): Promise<User> {
  if (!API_BASE_URL || !DEMO_USER_ID) {
    return simulateNetwork(mockProfile, 450);
  }

  try {
    return await apiGet<User>(`/api/profile/${DEMO_USER_ID}`);
  } catch {
    return mockProfile;
  }
}
