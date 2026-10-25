import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { AppText } from '@/components/ui/app-text';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
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
import { styles } from '@/styles/criteria.styles';
import { Colors } from '@/theme';
import type {
  BudgetOption,
  BudgetTier,
  CravingKey,
  Distance,
  MatchCriteria,
  MinRating,
} from '@/types';

export type CriteriaSheetProps = {
  criteria: MatchCriteria | null;
  onClose: () => void;
  onSpin: (criteria: MatchCriteria) => void;
  spinning?: boolean;
  error?: string | null;
};

export function CriteriaSheet({ onClose, ...restProps }: CriteriaSheetProps) {
  return (
    <BottomSheet onClose={onClose}>
      <CriteriaSheetContent onClose={onClose} {...restProps} />
    </BottomSheet>
  );
}

function CriteriaSheetContent({
  criteria,
  onClose,
  onSpin,
  spinning = false,
  error = null,
}: CriteriaSheetProps) {
  const { close, panGesture } = useBottomSheet();
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(criteria?.budgetTier ?? 'pas');
  const [cravings, setCravings] = useState<CravingKey[]>(
    criteria?.cravings ?? [DEFAULT_CRAVING]
  );
  const [distance, setDistance] = useState<Distance>(criteria?.distance ?? '3km');
  const [minRating, setMinRating] = useState<MinRating>(criteria?.minRating ?? '4.0');

  const mood = BUDGET_TIERS.find((option) => option.tier === budgetTier) ?? BUDGET_TIERS[0];
  const distanceOption = DISTANCE_OPTIONS.find((option) => option.value === distance) ?? DISTANCE_OPTIONS[0];
  const ratingOption = RATING_OPTIONS.find((option) => option.value === minRating) ?? RATING_OPTIONS[0];

  const toggleCraving = (craving: CravingKey) => {
    if (craving === DEFAULT_CRAVING) {
      setCravings([DEFAULT_CRAVING]);
      return;
    }

    const selected = cravings.includes(craving)
      ? cravings.filter((value) => value !== craving)
      : [...cravings.filter((value) => value !== DEFAULT_CRAVING), craving];

    setCravings(selected.length > 0 ? selected : [DEFAULT_CRAVING]);
  };

  const handlePressClose = () => {
    if (close) {
      close();
    } else {
      onClose();
    }
  };

  const headerContent = (
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
        onPress={handlePressClose}
        style={styles.close}>
        <Icon name="close" size={18} color={Colors.onSurface} />
      </PressableScale>
    </View>
  );

  return (
    <>
      {panGesture ? (
        <GestureDetector gesture={panGesture}>
          {headerContent}
        </GestureDetector>
      ) : (
        headerContent
      )}

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
            {CRAVING_OPTIONS.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                variant={cravings.includes(option.key) ? 'selected' : 'tint'}
                onPress={() => toggleCraving(option.key)}
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
        {error ? (
          <AppText variant="labelSm" color={Colors.error} style={styles.error}>
            {error}
          </AppText>
        ) : null}
        <PillButton
          label="Acak!"
          icon="casino"
          size="lg"
          loading={spinning}
          onPress={() => onSpin({ budgetTier, cravings, distance, minRating })}
          style={styles.cta}
        />
      </View>
    </>
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