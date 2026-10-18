import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/home/app-header';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { useAsync } from '@/hooks/use-async';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getSavedCriteria } from '@/services/criteria.service';
import { Colors, Layout, Radii, Shadows, Spacing } from '@/theme';

export default function MatchScreen() {
  const padding = useScreenPadding();
  const { result } = useAsync(getSavedCriteria);
  const flow = useMatchFlow();
  const criteria = result.status === 'success' ? result.data : null;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, padding]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.badge}>
            <Icon name="casino" size={40} color={Colors.primary} filled />
          </View>
          <AppText variant="headlineMd">Takdir Mode</AppText>
          <AppText variant="bodyMd" color={Colors.onSurfaceVariant} style={styles.text}>
            Atur budget, selera, dan jarak. Biar Terserah App yang nentuin kamu makan di mana hari
            ini.
          </AppText>
          <PillButton label="Atur Kriteria" icon="tune" size="lg" onPress={flow.openSheet} />
        </View>
      </ScrollView>
      <AppHeader label="Match" />
      <MatchFlowModals flow={flow} criteria={criteria} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Layout.marginMobile,
  },
  inner: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
    ...Shadows.soft,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primaryContainerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
