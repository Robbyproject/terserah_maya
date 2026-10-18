import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Brand } from '@/constants/brand';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/theme';

export type InstantDecisionHeroProps = {
  onPress: () => void;
};

export function InstantDecisionHero({ onPress }: InstantDecisionHeroProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Atur kriteria dan acak tempat makan"
      scaleTo={0.99}
      onPress={onPress}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientVia, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.decor} pointerEvents="none">
          <View style={styles.decorRing} />
          <View style={styles.decorLineVertical} />
          <View style={styles.decorLineHorizontal} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Chip label="INSTANT DECISION" variant="overlay" size="sm" icon="bolt" />
            <Chip label="1-Tap Ready" variant="sky" size="sm" />
          </View>
          <View style={styles.copy}>
            <AppText variant="headlineMd" color={Colors.onPrimary} style={styles.title}>
              Terlalu Malas Milih?
            </AppText>
            <AppText variant="bodyMd" color={Colors.onPrimaryMuted} style={styles.subtitle}>
              Biarkan mesin takdir Terserah App yang memutuskan tempat makanmu sekarang juga!
            </AppText>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.avatars}>
              {Brand.heroAvatars.map((uri, index) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                  contentFit="cover"
                />
              ))}
            </View>
            <View style={styles.cta}>
              <AppText variant="labelSm" color={Colors.onPrimary}>
                Atur &amp; Spin
              </AppText>
              <View style={styles.ctaPill}>
                <AppText variant="labelSm" color={Colors.primary}>
                  Cari 🎲
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.ambient,
  },
  decor: {
    position: 'absolute',
    right: -32,
    bottom: -32,
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: Radii.pill,
    borderWidth: 6,
    borderStyle: 'dashed',
    borderColor: Colors.heroDecor,
  },
  decorLineVertical: {
    position: 'absolute',
    width: 6,
    height: 126,
    backgroundColor: Colors.heroDecor,
  },
  decorLineHorizontal: {
    position: 'absolute',
    width: 126,
    height: 6,
    backgroundColor: Colors.heroDecor,
  },
  content: {
    gap: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  copy: {
    gap: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.extrabold,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  cta: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  ctaPill: {
    paddingHorizontal: 10,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    backgroundColor: Colors.onPrimary,
    ...Shadows.soft,
  },
});
