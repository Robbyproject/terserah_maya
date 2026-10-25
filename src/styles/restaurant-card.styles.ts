import { StyleSheet } from 'react-native';

import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  // ----- Card -----
  pressable: {
    width: '100%',
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.soft,
  },
  body: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
  },
  // ----- Image -----
  imageWrap: {
    width: 80,
    height: 80,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
  },
  // Same footprint as image; neutral surface + icon when imageUrl is missing.
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 1,
    maxWidth: 80,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.inverseSurface,
  },
  // ----- Text -----
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    color: Colors.onSurface,
    fontFamily: FontFamily.bold,
  },
  bookmark: {
    marginLeft: Spacing.sm,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ----- Meta -----
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: 6,
  },
  price: {
    fontFamily: FontFamily.bold,
  },
});
