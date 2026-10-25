import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Brand } from '@/constants/brand';
import { Colors, Spacing } from '@/theme';

export type LogoProps = {
  size?: number;
};

export function Logo({ size = 32 }: LogoProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      <Image
        source={{ uri: Brand.logoUrl }}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel="Terserah App Logo"
      />
      <AppText variant="headlineSm" color={Colors.onSurface} style={{ letterSpacing: -0.2 }}>
        {Brand.name}
      </AppText>
    </View>
  );
}
