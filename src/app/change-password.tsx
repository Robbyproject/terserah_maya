// File: src/app/change-password.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import {
  AUTH_VALIDATION_MESSAGES,
  changeUserPassword,
  getCurrentUser,
  STRONG_PASSWORD_REGEX,
} from '@/services/user.service';
import { styles } from '@/styles/change-password.styles';
import { Colors } from '@/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Harap lengkapi semua kolom kata sandi.');
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.passwordWeak);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const currentUser = await getCurrentUser();
      const res = await changeUserPassword(currentUser.id, oldPassword, newPassword);

      Alert.alert('Berhasil', res?.message || 'Kata sandi berhasil diperbarui.', [
        {
          text: 'Kembali ke Profil',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Kata sandi lama salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <View style={styles.headingBlock}>
              <AppText variant="headlineSm">Keamanan Akun</AppText>
              <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
                Kata sandi baru minimal 8 karakter & wajib kombinasi huruf, angka, dan simbol.
              </AppText>
            </View>

            <View style={styles.card}>
              {/* Kata Sandi Saat Ini */}
              <View style={styles.inputGroup}>
                <AppText variant="labelMd">Kata Sandi Saat Ini</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    accessibilityLabel="Kata Sandi Saat Ini"
                    secureTextEntry={!showOld}
                    value={oldPassword}
                    editable={!loading}
                    onChangeText={(text) => {
                      setOldPassword(text);
                      setErrorMsg('');
                    }}
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
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setErrorMsg('');
                    }}
                    placeholder="Min. 8 karakter (huruf + angka + simbol)"
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
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setErrorMsg('');
                    }}
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

              {errorMsg ? (
                <View
                  style={{
                    backgroundColor: '#FEE2E2',
                    padding: 12,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
                    {errorMsg}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}