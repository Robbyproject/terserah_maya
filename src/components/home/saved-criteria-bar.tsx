import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Skeleton } from '@/components/ui/skeleton';
import { describeCriteria } from '@/lib/match';
import { Colors, Radii, Spacing } from '@/theme';
import type { MatchCriteria } from '@/types';

export type SavedCriteriaBarProps = {
  criteria: MatchCriteria | null;
  onEdit: () => void;
};

export function SavedCriteriaBar({ criteria, onEdit }: SavedCriteriaBarProps) {
  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Icon name="tune" size={20} color={Colors.primary} />
        </View>
        <View style={styles.copy}>
          <AppText variant="labelMd">Kriteria Tersimpan</AppText>
          {criteria ? (
            <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
              {describeCriteria(criteria)}
            </AppText>
          ) : (
            <Skeleton width={180} height={16} />
          )}
        </View>
      </View>
      <PillButton label="Ubah" variant="white" size="sm" onPress={onEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
  },
  left: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: Colors.primaryContainerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flexShrink: 1,
    gap: 2,
  },
});
