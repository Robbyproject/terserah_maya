import { CriteriaSheet } from '@/components/match/criteria-sheet';
import { MatchResultModal } from '@/components/match/match-result-modal';
import type { MatchFlow } from '@/hooks/use-match-flow';
import type { MatchCriteria } from '@/types';

export type MatchFlowModalsProps = {
  flow: MatchFlow;
  criteria: MatchCriteria | null;
};

export function MatchFlowModals({ flow, criteria }: MatchFlowModalsProps) {
  return (
    <>
      {flow.sheetVisible ? (
        <CriteriaSheet
          criteria={criteria}
          spinning={flow.spinning}
          onClose={flow.closeSheet}
          onSpin={flow.spin}
        />
      ) : null}
      {flow.match ? (
        <MatchResultModal
          restaurant={flow.match}
          onClose={flow.dismissMatch}
          onRespin={flow.respin}
        />
      ) : null}
    </>
  );
}
