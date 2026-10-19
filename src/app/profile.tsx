import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TerserahTabBar } from '@/components/navigation/tab-bar';
import { useAsync } from '@/hooks/use-async';
import { useScreenPadding } from '@/hooks/use-screen-padding';
import { getCurrentUser } from '@/services/user.service';
import { Colors, FontFamily, Layout, Radii, Shadows, Spacing } from '@/theme';
import type { User } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const padding = useScreenPadding();
  const { result, reload } = useAsync(getCurrentUser);
  const [profileOverrides, setProfileOverrides] = useState<Partial<User>>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const user = result.status === 'success' ? { ...result.data, ...profileOverrides } : null;

  const openEditProfile = () => {
    setDraftName(user?.name ?? '');
    setDraftEmail(user?.email ?? '');
    setIsEditModalVisible(true);
  };

  const saveProfile = () => {
    const name = draftName.trim();
    const email = draftEmail.trim();

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Periksa kembali', 'Masukkan nama dan alamat email yang valid.');
      return;
    }

    setProfileOverrides({ name, email });
    setIsEditModalVisible(false);
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
        contentContainerStyle={[
          styles.content,
          padding,
          { paddingTop: padding.paddingTop - Layout.headerHeight },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.pageHeading}>
            <AppText variant="headlineLg">Profil</AppText>
            <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
              Kelola informasi dan pengaturan akunmu
            </AppText>
          </View>

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
                    {result.status === 'error' ? result.error.message : 'Memuat profil...'}
                  </AppText>
                )}
              </View>
            </View>
            {user ? (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Edit profil"
                onPress={openEditProfile}
                style={styles.editButton}>
                <Icon name="edit" size={17} color={Colors.primary} />
                <AppText variant="labelMd" color={Colors.primary}>
                  Edit profil
                </AppText>
              </PressableScale>
            ) : result.status === 'error' ? (
              <PressableScale
                accessibilityRole="button"
                onPress={reload}
                style={styles.editButton}>
                <AppText variant="labelMd" color={Colors.primary}>
                  Coba lagi
                </AppText>
              </PressableScale>
            ) : null}
            <View pointerEvents="none" style={styles.profileDecoration} />
          </LinearGradient>

          <View style={styles.section}>
            <SectionHeading title="Pengaturan akun" icon="settings" />
            <View style={styles.settingsCard}>
              <SettingsRow
                icon="person"
                label="Edit profil"
                description="Perbarui nama dan email"
                onPress={openEditProfile}
              />
              <View style={styles.separator} />
              <SettingsRow
                icon="lock"
                label="Ubah kata sandi"
                description="Jaga keamanan akunmu"
                onPress={() => router.push('/changepassword')}
              />
              <View style={styles.separator} />
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Icon name="notifications" size={20} color={Colors.primary} />
                </View>
                <View style={styles.settingCopy}>
                  <AppText variant="labelLg">Notifikasi</AppText>
                  <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
                    Info rekomendasi dan tempat baru
                  </AppText>
                </View>
                <Switch
                  accessibilityLabel="Aktifkan notifikasi"
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.outlineVariant, true: Colors.brandSky }}
                  thumbColor={Colors.surfaceContainerLowest}
                />
              </View>
              <View style={styles.separator} />
              <SettingsRow
                icon="logout"
                label="Keluar akun"
                description="Keluar dari akun di perangkat ini"
                onPress={confirmLogout}
                danger
                showChevron={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <TerserahTabBar />
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.modalHeading}>
              <View>
                <AppText variant="headlineSm">Edit profil</AppText>
                <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
                  Sesuaikan informasi akunmu
                </AppText>
              </View>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Tutup"
                onPress={() => setIsEditModalVisible(false)}
                style={styles.closeButton}>
                <Icon name="close" size={22} color={Colors.onSurfaceVariant} />
              </PressableScale>
            </View>
            <AppText variant="labelMd">Nama</AppText>
            <TextInput
              accessibilityLabel="Nama"
              autoCapitalize="words"
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Nama kamu"
              placeholderTextColor={Colors.outline}
              style={styles.input}
            />
            <AppText variant="labelMd">Email</AppText>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="nama@email.com"
              placeholderTextColor={Colors.outline}
              style={styles.input}
            />
            <PressableScale
              accessibilityRole="button"
              onPress={saveProfile}
              style={styles.saveButton}>
              <AppText variant="labelLg" color={Colors.onPrimary}>
                Simpan perubahan
              </AppText>
            </PressableScale>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon,
  count,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  count?: number;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionIcon}>
        <Icon name={icon} size={19} color={Colors.primary} />
      </View>
      <View style={styles.sectionCopy}>
        <AppText variant="headlineSm" style={styles.sectionTitle}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {count !== undefined ? (
        <View style={styles.countPill}>
          <AppText variant="labelMd" color={Colors.primary}>
            {count}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  description,
  onPress,
  danger = false,
  showChevron = true,
}: {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}) {
  const color = danger ? Colors.error : Colors.primary;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.settingRow}>
      <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View style={styles.settingCopy}>
        <AppText variant="labelLg" color={danger ? Colors.error : Colors.onSurface}>
          {label}
        </AppText>
        <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
          {description}
        </AppText>
      </View>
      {showChevron ? <Icon name="chevron_right" size={22} color={Colors.outline} /> : null}
    </PressableScale>
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
    gap: Spacing.xl,
  },
  pageHeading: {
    gap: Spacing.xs,
  },
  profileCard: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: Radii.xl,
    ...Shadows.ambient,
  },
  profileInfo: {
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 1,
  },
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: Radii.pill,
    padding: 3,
    backgroundColor: Colors.overlayWhiteStrong,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Radii.pill,
  },
  avatarFallback: {
    flex: 1,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCopy: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  editButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLowest,
    zIndex: 1,
  },
  profileDecoration: {
    position: 'absolute',
    width: 176,
    height: 176,
    right: -70,
    top: -94,
    borderRadius: Radii.pill,
    borderWidth: 30,
    borderColor: Colors.overlayWhite,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: Colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
    gap: 1,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  countPill: {
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.pill,
    backgroundColor: Colors.primaryFixed,
  },
  settingsCard: {
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.brandTintBorder,
    ...Shadows.soft,
  },
  settingRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandTint,
  },
  dangerIcon: {
    backgroundColor: Colors.errorContainer,
  },
  settingCopy: {
    flex: 1,
    gap: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
    marginLeft: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.marginMobile,
    backgroundColor: Colors.overlayInverse,
  },
  editModal: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.ambient,
  },
  modalHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerLow,
  },
  input: {
    minHeight: 48,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.brandInputBorder,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    color: Colors.onSurface,
    fontFamily: FontFamily.regular,
    fontSize: 15,
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
