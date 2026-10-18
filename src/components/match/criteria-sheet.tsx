import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import {
  BUDGET_TIERS,
  CRAVING_OPTIONS,
  DEFAULT_CRAVING,
  DISTANCE_OPTIONS,
  RATING_OPTIONS,
} from '@/constants/match';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';
import type { BudgetOption, BudgetTier, Distance, MatchCriteria, MinRating } from '@/types';

export type CriteriaSheetProps = {
  criteria: MatchCriteria | null;
  onClose: () => void;
  onSpin: (criteria: MatchCriteria) => void;
  spinning?: boolean;
};

export function CriteriaSheet({ criteria, onClose, onSpin, spinning = false }: CriteriaSheetProps) {
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(criteria?.budgetTier ?? 'pas');
  const [cravings, setCravings] = useState<string[]>(criteria?.cravings ?? [DEFAULT_CRAVING]);
  const [distance, setDistance] = useState<Distance>(criteria?.distance ?? '3km');
  const [minRating, setMinRating] = useState<MinRating>(criteria?.minRating ?? '4.0');

  const mood = BUDGET_TIERS.find((option) => option.tier === budgetTier) ?? BUDGET_TIERS[0];
  const distanceOption = DISTANCE_OPTIONS.find((option) => option.value === distance) ?? DISTANCE_OPTIONS[0];
  const ratingOption = RATING_OPTIONS.find((option) => option.value === minRating) ?? RATING_OPTIONS[0];

  const toggleCraving = (craving: string) => {
    if (craving === DEFAULT_CRAVING) {
      setCravings([DEFAULT_CRAVING]);
      return;
    }

    const selected = cravings.includes(craving)
      ? cravings.filter((value) => value !== craving)
      : [...cravings.filter((value) => value !== DEFAULT_CRAVING), craving];

    setCravings(selected.length > 0 ? selected : [DEFAULT_CRAVING]);
  };

  return (
    <BottomSheet onClose={onClose}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Tutup kriteria"
        onPress={onClose}
        style={styles.handleArea}>
        <View style={styles.handle} />
      </PressableScale>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <View style={styles.titleRow}>
            <AppText variant="labelLg" style={styles.title}>
              Set Kriteria Match 🎲
            </AppText>
            <Chip label="Takdir Mode" variant="filled" size="sm" />
          </View>
          <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
            Tentukan budget &amp; selera, biar takdir yang cariin!
          </AppText>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Tutup"
          onPress={onClose}
          style={styles.close}>
          <Icon name="close" size={18} color={Colors.onSurface} />
        </PressableScale>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.step}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitle}>
              <View style={styles.stepBadge}>
                <AppText variant="labelSm" color={Colors.onPrimary}>
                  1
                </AppText>
              </View>
              <AppText variant="headlineSm" style={styles.stepTitleText}>
                Pilih Budget Makan
              </AppText>
            </View>
            <View style={styles.moodBadge}>
              <AppText variant="labelSm">{mood.emoji}</AppText>
              <AppText variant="labelSm" color={Colors.onSecondaryContainer} style={styles.bold}>
                {mood.moodLabel}
              </AppText>
            </View>
          </View>
          <View style={styles.grid}>
            {BUDGET_TIERS.map((option) => (
              <BudgetCard
                key={option.tier}
                option={option}
                selected={option.tier === budgetTier}
                onSelect={() => setBudgetTier(option.tier)}
              />
            ))}
          </View>
        </View>
        <View style={styles.step}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitle}>
              <View style={[styles.stepBadge, styles.stepBadgeMuted]}>
                <AppText variant="labelSm" color={Colors.onSurface}>
                  2
                </AppText>
              </View>
              <AppText variant="headlineSm" style={styles.stepTitleText}>
                Lagi Pengen Apa?
              </AppText>
            </View>
            <Chip label="Opsional" variant="accent" size="sm" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cravings}>
            {CRAVING_OPTIONS.map((craving) => (
              <Chip
                key={craving}
                label={craving}
                variant={cravings.includes(craving) ? 'selected' : 'tint'}
                onPress={() => toggleCraving(craving)}
              />
            ))}
          </ScrollView>
          <View style={styles.selectors}>
            <View style={styles.selectorCard}>
              <View style={styles.selectorHeader}>
                <View style={styles.selectorLabel}>
                  <Icon name="directions_walk" size={16} color={Colors.primary} />
                  <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
                    Jarak
                  </AppText>
                </View>
                <AppText variant="labelSm" style={styles.bold}>
                  {distanceOption.display}
                </AppText>
              </View>
              <View style={styles.segmented}>
                {DISTANCE_OPTIONS.map((option) => (
                  <SegmentedButton
                    key={option.value}
                    label={option.label}
                    active={option.value === distance}
                    onPress={() => setDistance(option.value)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.selectorCard}>
              <View style={styles.selectorHeader}>
                <View style={styles.selectorLabel}>
                  <Icon name="star" size={16} color={Colors.amber} filled />
                  <AppText variant="labelSm" color={Colors.onSurfaceVariant}>
                    Rating
                  </AppText>
                </View>
                <AppText variant="labelSm" style={styles.bold}>
                  {ratingOption.display}
                </AppText>
              </View>
              <View style={styles.segmented}>
                {RATING_OPTIONS.map((option) => (
                  <SegmentedButton
                    key={option.value}
                    label={option.label}
                    active={option.value === minRating}
                    onPress={() => setMinRating(option.value)}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PillButton
          label="Acak!"
          icon="casino"
          size="lg"
          loading={spinning}
          onPress={() => onSpin({ budgetTier, cravings, distance, minRating })}
          style={styles.cta}
        />
      </View>
    </BottomSheet>
  );
}

function BudgetCard({
  option,
  selected,
  onSelect,
}: {
  option: BudgetOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const foreground = selected ? Colors.onPrimary : Colors.onSurface;
  const muted = selected ? Colors.onPrimaryMuted : Colors.onSurfaceVariant;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={[styles.budgetCard, selected && styles.budgetCardSelected]}>
      <View style={styles.budgetTop}>
        <AppText variant="labelMd" color={foreground} style={styles.bold}>
          {option.label}
        </AppText>
        <View style={[styles.symbol, selected && styles.symbolSelected]}>
          <AppText variant="labelSm" color={selected ? Colors.onPrimary : Colors.onSurfaceVariant}>
            {option.favorite ? '★' : option.symbol}
          </AppText>
        </View>
      </View>
      <View>
        <AppText variant="headlineSm" color={foreground}>
          {option.range}
        </AppText>
        <AppText variant="labelSm" color={muted}>
          {option.caption}
        </AppText>
      </View>
    </PressableScale>
  );
}

function SegmentedButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.segment, active && styles.segmentActive]}>
      <AppText
        variant="labelSm"
        color={active ? Colors.onSecondaryContainer : Colors.onSurfaceVariant}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  handleArea: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  headerCopy: {
    flexShrink: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  step: {
    gap: Spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stepTitle: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepTitleText: {
    flexShrink: 1,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeMuted: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.secondaryFixed,
    ...Shadows.soft,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  budgetCard: {
    flexBasis: '45%',
    flexGrow: 1,
    height: 96,
    justifyContent: 'space-between',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
    overflow: 'hidden',
  },
  budgetCardSelected: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
    ...Shadows.ambient,
  },
  budgetTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  symbol: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  symbolSelected: {
    backgroundColor: Colors.secondaryContainer,
  },
  bold: {
    fontFamily: FontFamily.bold,
  },
  cravings: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  selectors: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorCard: {
    flex: 1,
    gap: 6,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  selectorLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  segmented: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  segmentActive: {
    backgroundColor: Colors.secondaryContainer,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerLow,
  },
  cta: {
    width: '100%',
  },
});
