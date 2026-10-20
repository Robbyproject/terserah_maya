import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { styles } from '@/styles/profile.styles';
import { Colors } from '@/theme';
import type { User } from '@/types';

type ProfileCardProps = {
  user: User | null;
  errorMessage?: string;
  onEditPress: () => void;
  onReload: () => void;
};

export function ProfileCard({ user, errorMessage, onEditPress, onReload }: ProfileCardProps) {
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientVia, Colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.profileCard}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarFrame}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Icon name="person" size={38} color={Colors.primary} filled />
            </View>
          )}
        </View>
        <View style={styles.profileCopy}>
          {user ? (
            <>
              <AppText variant="headlineSm" color={Colors.onPrimary} numberOfLines={1}>
                {user.name}
              </AppText>
              <AppText variant="bodySm" color={Colors.onPrimaryMuted} numberOfLines={1}>
                {user.email}
              </AppText>
            </>
          ) : (
            <AppText variant="bodySm" color={Colors.onPrimaryMuted} numberOfLines={2}>
              {errorMessage || 'Memuat profil...'}
            </AppText>
          )}
        </View>
      </View>

      {user ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Edit profil"
          onPress={onEditPress}
          style={styles.editButton}>
          <Icon name="edit" size={17} color={Colors.primary} />
          <AppText variant="labelMd" color={Colors.primary}>
            Edit profil
          </AppText>
        </PressableScale>
      ) : errorMessage ? (
        <PressableScale
          accessibilityRole="button"
          onPress={onReload}
          style={styles.editButton}>
          <AppText variant="labelMd" color={Colors.primary}>
            Coba lagi
          </AppText>
        </PressableScale>
      ) : null}

      <View pointerEvents="none" style={styles.profileDecoration} />
    </LinearGradient>
  );
}