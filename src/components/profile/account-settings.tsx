import { useRouter } from 'expo-router';
import { Switch, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { styles } from '@/styles/profile.styles';
import { Colors } from '@/theme';

type AccountSettingsProps = {
  onOpenEditProfile: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (val: boolean) => void;
  onLogout: () => void;
};

export function AccountSettings({
  onOpenEditProfile,
  notificationsEnabled,
  onToggleNotifications,
  onLogout,
}: AccountSettingsProps) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionIcon}>
          <Icon name="settings" size={19} color={Colors.primary} />
        </View>
        <View style={styles.sectionCopy}>
          <AppText variant="headlineSm" style={styles.sectionTitle}>
            Pengaturan akun
          </AppText>
        </View>
      </View>

      <View style={styles.settingsCard}>
        <SettingsRow
          icon="person"
          label="Edit profil"
          description="Perbarui nama dan email"
          onPress={onOpenEditProfile}
        />
        <View style={styles.separator} />
        
        {/* Pindah ke halaman change-password dan kembali ke profil saat back */}
        <SettingsRow
          icon="lock"
          label="Ubah kata sandi"
          description="Jaga keamanan akunmu"
          onPress={() => router.push('/change-password')}
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
            onValueChange={onToggleNotifications}
            trackColor={{ false: Colors.outlineVariant, true: Colors.brandSky }}
            thumbColor={Colors.surfaceContainerLowest}
          />
        </View>
        <View style={styles.separator} />
        
        <SettingsRow
          icon="logout"
          label="Keluar akun"
          description="Keluar dari akun di perangkat ini"
          onPress={onLogout}
          danger
          showChevron={false}
        />
      </View>
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