import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { AccountSettings } from '@/components/profile/account-settings';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { ProfileCard } from '@/components/profile/profile-card';
import { AppText } from '@/components/ui/app-text';
import { useAsync } from '@/hooks/use-async';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { chooseAvatar } from '@/services/avatar-picker';
import { getCurrentUser, updateUserAvatar } from '@/services/user.service';
import { styles } from '@/styles/profile.styles';
import { Colors } from '@/theme';
import type { User } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const padding = useScreenPadding();
  const { result, reload } = useAsync(getCurrentUser);

  const [profileOverrides, setProfileOverrides] = useState<Partial<User>>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const user = result.status === 'success' ? { ...result.data, ...profileOverrides } : null;

  const handleSaveProfile = (name: string, email: string) => {
    setProfileOverrides((prev) => ({ ...prev, name, email }));
  };

  const handleChangeAvatar = async () => {
    if (!user) return;

    const uri = await chooseAvatar();
    if (!uri) return;

    const previous = user.avatarUrl;
    setProfileOverrides((prev) => ({ ...prev, avatarUrl: uri })); // tampil langsung
    setIsUploadingAvatar(true);

    try {
      const updated = await updateUserAvatar(user.id, uri);
      setProfileOverrides((prev) => ({ ...prev, avatarUrl: updated.avatarUrl }));
    } catch (e) {
      setProfileOverrides((prev) => ({ ...prev, avatarUrl: previous })); // batalkan
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Foto profil gagal diunggah');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Keluar akun?', 'Kamu bisa masuk lagi kapan saja.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => router.replace('/') },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, padding]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.pageHeading}>
            <AppText variant="headlineLg">Profile</AppText>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
              Kelola informasi dan pengaturan akunmu
            </AppText>
          </View>

          <ProfileCard
            user={user}
            errorMessage={result.status === 'error' ? result.error.message : undefined}
            isUploadingAvatar={isUploadingAvatar}
            onEditPress={() => setIsEditModalVisible(true)}
            onAvatarPress={handleChangeAvatar}
            onReload={reload}
          />

          <AccountSettings
            onOpenEditProfile={() => setIsEditModalVisible(true)}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={setNotificationsEnabled}
            onLogout={confirmLogout}
          />
        </View>
      </ScrollView>

      <EditProfileModal
        visible={isEditModalVisible}
        initialName={user?.name ?? ''}
        initialEmail={user?.email ?? ''}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
}