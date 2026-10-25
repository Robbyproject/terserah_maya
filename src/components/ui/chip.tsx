import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, FontFamily, Radii, Spacing, type TypographyVariant } from '@/theme';

export type ChipVariant = 'tint' | 'tintHigh' | 'selected' | 'accent' | 'filled' | 'sky' | 'overlay';
export type ChipSize = 'sm' | 'md';

export type ChipProps = {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: string;
  iconFilled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const chipColors: Record<ChipVariant, { background: string; foreground: string }> = {
  tint: { background: Colors.surfaceContainerLow, foreground: Colors.onSurface },
  tintHigh: { background: Colors.surfaceContainerHigh, foreground: Colors.onSurface },
  selected: { background: Colors.inverseSurface, foreground: Colors.inverseOnSurface },
  accent: { background: Colors.primaryFixed, foreground: Colors.primary },
  filled: { background: Colors.secondaryContainer, foreground: Colors.onSecondaryContainer },
  sky: { background: Colors.brandInputBorder, foreground: Colors.gradientEnd },
  overlay: { background: Colors.overlayWhite, foreground: Colors.onPrimary },
};

const labelVariants: Record<ChipSize, TypographyVariant> = {
  sm: 'labelSm',
  md: 'labelMd',
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: Spacing.xs,
  },
});

export function Chip({
  label,
  variant = 'tint',
  size = 'md',
  icon,
  iconFilled = false,
  onPress,
  style,
}: ChipProps) {
  const colors = chipColors[variant];
  const content = (
    <>
      {icon ? (
        <Icon name={icon} size={size === 'md' ? 14 : 12} color={colors.foreground} filled={iconFilled} />
      ) : null}
      <AppText variant={labelVariants[size]} color={colors.foreground} style={{ fontFamily: FontFamily.bold }}>
        {label}
      </AppText>
    </>
  );
  const chipStyle = [
    styles.base,
    styles[size],
    { backgroundColor: colors.background },
    style,
  ];

  if (!onPress) {
    return <View style={chipStyle}>{content}</View>;
  }

  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={chipStyle}>
      {content}
    </PressableScale>
  );
}
