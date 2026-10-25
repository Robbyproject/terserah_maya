import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { changeUserPassword, getCurrentUser } from '@/services/user.service';
import { styles } from '@/styles/change-password.styles';
import { Colors } from '@/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Periksa kembali', 'Harap lengkapi semua kolom kata sandi.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Kata Sandi Lemah', 'Kata sandi baru minimal harus 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Tidak Cocok', 'Konfirmasi kata sandi baru tidak sesuai.');
      return;
    }

    try {
      setLoading(true);
      // Ambil user ID dari sesi login aktif di HP
      const currentUser = await getCurrentUser();
      
      // Panggil backend API Express
      await changeUserPassword(currentUser.id, oldPassword, newPassword);

      Alert.alert('Berhasil', 'Kata sandi akunmu berhasil diperbarui!', [
        {
          text: 'Kembali ke Profil',
          onPress: () => router.back(), // Kembali ke halaman Profile
        },
      ]);
    } catch (error: any) {
      Alert.alert('Gagal Mengubah Sandi', error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header dengan Tombol Kembali ke Profile */}
      <View style={styles.header}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Kembali ke profil"
          onPress={() => router.back()}
          style={styles.backButton}>
          <Icon name="arrow_back" size={22} color={Colors.onSurface} />
        </PressableScale>
        <AppText variant="labelLg" style={styles.headerTitle}>
          Ubah Kata Sandi
        </AppText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <View style={styles.headingBlock}>
              <AppText variant="headlineSm">Keamanan Akun</AppText>
              <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
                Pastikan kata sandi barumu unik dan sulit ditebak orang lain.
              </AppText>
            </View>

            <View style={styles.card}>
              {/* Kata Sandi Lama */}
              <View style={styles.inputGroup}>
                <AppText variant="labelMd">Kata Sandi Saat Ini</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    accessibilityLabel="Kata Sandi Saat Ini"
                    secureTextEntry={!showOld}
                    value={oldPassword}
                    editable={!loading}
                    onChangeText={setOldPassword}
                    placeholder="Masukkan kata sandi lama"
                    placeholderTextColor={Colors.outline}
                    style={styles.input}
                  />
                  <PressableScale
                    onPress={() => setShowOld(!showOld)}
                    style={styles.eyeButton}>
                    <Icon
                      name={showOld ? 'visibility' : 'visibility_off'}
                      size={20}
                      color={Colors.onSurfaceVariant}
                    />
                  </PressableScale>
                </View>
              </View>

              {/* Kata Sandi Baru */}
              <View style={styles.inputGroup}>
                <AppText variant="labelMd">Kata Sandi Baru</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    accessibilityLabel="Kata Sandi Baru"
                    secureTextEntry={!showNew}
                    value={newPassword}
                    editable={!loading}
                    onChangeText={setNewPassword}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={Colors.outline}
                    style={styles.input}
                  />
                  <PressableScale
                    onPress={() => setShowNew(!showNew)}
                    style={styles.eyeButton}>
                    <Icon
                      name={showNew ? 'visibility' : 'visibility_off'}
                      size={20}
                      color={Colors.onSurfaceVariant}
                    />
                  </PressableScale>
                </View>
              </View>

              {/* Konfirmasi Kata Sandi Baru */}
              <View style={styles.inputGroup}>
                <AppText variant="labelMd">Konfirmasi Kata Sandi Baru</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    accessibilityLabel="Konfirmasi Kata Sandi Baru"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    editable={!loading}
                    onChangeText={setConfirmPassword}
                    placeholder="Ulangi kata sandi baru"
                    placeholderTextColor={Colors.outline}
                    style={styles.input}
                  />
                  <PressableScale
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeButton}>
                    <Icon
                      name={showConfirm ? 'visibility' : 'visibility_off'}
                      size={20}
                      color={Colors.onSurfaceVariant}
                    />
                  </PressableScale>
                </View>
              </View>

              {/* Tombol Simpan */}
              <PressableScale
                accessibilityRole="button"
                onPress={handleSave}
                disabled={loading}
                style={[styles.saveButton, loading && { opacity: 0.7 }]}>
                {loading ? (
                  <ActivityIndicator color={Colors.onPrimary} />
                ) : (
                  <AppText variant="labelLg" color={Colors.onPrimary}>
                    Simpan Kata Sandi
                  </AppText>
                )}
              </PressableScale>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}