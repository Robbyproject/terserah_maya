import { Text, type StyleProp, type TextStyle } from 'react-native';

import { Colors, FontFamily } from '@/theme';

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 24, color = Colors.onSurface, filled = false, style }: IconProps) {
  return (
    <Text
      allowFontScaling={false}
      style={[
        {
          fontFamily: filled ? FontFamily.iconFilled : FontFamily.icon,
          fontSize: size,
          lineHeight: size * 1.2,
          color,
          includeFontPadding: false,
        },
        style,
      ]}>
      {name}
    </Text>
  );
}
