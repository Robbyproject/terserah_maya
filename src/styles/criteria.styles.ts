import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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