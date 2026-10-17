import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/home/app-header';
import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync } from '@/hooks/use-async';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getCurrentUser } from '@/services/user.service';
import { Colors, Layout, Radii, Shadows, Spacing } from '@/theme';

export default function ProfileScreen() {
  const padding = useScreenPadding();
  const { result } = useAsync(getCurrentUser);
  const user = result.status === 'success' ? result.data : null;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, padding]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color={Colors.secondary} filled />
          </View>
          {user ? (
            <AppText variant="headlineMd">{user.name}</AppText>
          ) : (
            <Skeleton width={140} height={30} radius={Radii.sm} />
          )}
          <Chip label="Profil segera hadir" variant="accent" size="md" style={styles.badge} />
          <AppText variant="bodyMd" color={Colors.onSurfaceVariant} style={styles.text}>
            Nanti di sini bakal ada riwayat match, tempat favorit, dan pengaturan akun kamu.
          </AppText>
        </View>
      </ScrollView>
      <AppHeader label="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Layout.marginMobile,
  },
  inner: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
    ...Shadows.soft,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radii.pill,
    backgroundColor: Colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
