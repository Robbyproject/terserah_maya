import { StyleSheet } from 'react-native';

import { Colors, Radii, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  // ----- Header -----
  root: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  headerCopy: {
    flexShrink: 1,
    gap: 2,
  },
  heading: {
    fontSize: 18,
    lineHeight: 25,
  },
  subhead: {
    fontSize: 11,
    lineHeight: 16,
  },
  // ----- See all link -----
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 6,
  },
  // ----- List -----
  list: {
    gap: Spacing.md,
  },
  // ----- Skeleton -----
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  skeletonBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  // ----- Messages -----
  message: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
  },
  messageText: {
    textAlign: 'center',
  },
});
