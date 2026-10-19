import { StyleSheet } from 'react-native';

import { Colors, Layout, Radii, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  // ----- Layout -----
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  list: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: Layout.maxContentWidth + Layout.marginMobile * 2,
    alignSelf: 'center',
    paddingHorizontal: Layout.marginMobile,
    gap: Spacing.md,
  },
  // ----- Header -----
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceContainerHighSoft,
  },
  headerBlur: {
    ...StyleSheet.absoluteFill,
  },
  headerTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlaySurface,
  },
  headerContent: {
    width: '100%',
    maxWidth: Layout.maxContentWidth + Layout.marginMobile * 2,
    alignSelf: 'center',
    paddingHorizontal: Layout.marginMobile,
    paddingTop: Spacing.xs,
    gap: Spacing.lg,
  },
  titleBlock: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    flexShrink: 0,
  },
  // ----- Skeleton -----
  skeletonList: {
    gap: Spacing.md,
  },
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
