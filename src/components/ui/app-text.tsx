import { Text, type TextProps } from 'react-native';

import { Colors, Typography, type TypographyVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export function AppText({ variant = 'bodyMd', color = Colors.onSurface, style, ...rest }: AppTextProps) {
  return <Text {...rest} style={[Typography[variant], { color }, style]} />;
}
