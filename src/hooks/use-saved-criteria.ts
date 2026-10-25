import { useSyncExternalStore } from 'react';

import {
  getCriteriaSnapshot,
  subscribeToCriteria,
} from '@/services/criteria.service';
import type { MatchCriteria } from '@/types';

export function useSavedCriteria(): MatchCriteria {
  return useSyncExternalStore(
    subscribeToCriteria,
    getCriteriaSnapshot,
    getCriteriaSnapshot,
  );
}
