import { Colors, Layout, Radii, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTint: {
    backgroundColor: Colors.overlayInverse,
  },
  sheet: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    overflow: 'hidden',
  },
  handleArea: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: 'transparent',
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerHighest,
  },
});