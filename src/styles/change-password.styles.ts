import { Colors, FontFamily, Layout, Radii, Shadows, Spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.marginMobile,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },
  placeholder: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.marginMobile,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    gap: Spacing.lg,
  },
  headingBlock: {
    gap: Spacing.xs,
  },
  card: {
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.brandTintBorder,
    gap: Spacing.md,
    ...Shadows.soft,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: Colors.brandInputBorder,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    color: Colors.onSurface,
    fontFamily: FontFamily.regular,
    fontSize: 15,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    borderRadius: Radii.pill,
    backgroundColor: Colors.brandSky,
    ...Shadows.glow,
  },
});