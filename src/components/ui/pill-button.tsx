import { ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, FontFamily, Radii, Shadows, Spacing, type TypographyVariant } from '@/theme';

export type PillButtonVariant = 'primary' | 'secondary' | 'ghost' | 'white' | 'neutral';
export type PillButtonSize = 'sm' | 'md' | 'lg';

export type PillButtonProps = {
  label: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  icon?: string;
  iconFilled?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const labelColors: Record<PillButtonVariant, string> = {
  primary: Colors.onPrimary,
  secondary: Colors.brandCerulean,
  ghost: Colors.brandSky,
  white: Colors.primary,
  neutral: Colors.onSurface,
};

const labelVariants: Record<PillButtonSize, TypographyVariant> = {
  sm: 'labelSm',
  md: 'labelMd',
  lg: 'headlineSm',
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radii.pill,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.glow,
  },
  secondary: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.brandSky,
  },
  ghost: {
    backgroundColor: Colors.brandTint,
  },
  white: {
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.soft,
  },
  neutral: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  sm: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  md: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconFilled = false,
  loading = false,
  disabled = false,
  style,
}: PillButtonProps) {
  const labelColor = labelColors[variant];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.base, styles[variant], styles[size], disabled && styles.disabled, style]}>
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <>
          {icon ? (
            <Icon
              name={icon}
              size={size === 'lg' ? 24 : 16}
              color={labelColor}
              filled={iconFilled}
            />
          ) : null}
          <AppText variant={labelVariants[size]} color={labelColor} style={{ fontFamily: FontFamily.bold }}>
            {label}
          </AppText>
        </>
      )}
    </PressableScale>
  );
}
