import { mockCriteria } from '@/mocks/criteria';
import { simulateNetwork } from '@/mocks/delay';
import type { MatchCriteria } from '@/types';

export function getSavedCriteria(): Promise<MatchCriteria> {
  return simulateNetwork(mockCriteria, 450);
}
