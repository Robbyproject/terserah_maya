// src/app/changepassword.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedScreen } from '../components/animated-screen';
import { resetPassword } from '../services/user.service';
import { styles } from '../styles/change.styles';

export default function ChangePasswordScreen() {
  const router = useRouter();

  // State Form
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetPassword = async () => {
    // 1. Validasi Kolom Kosong
    if (!email.trim() || !newPassword || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }

    // 2. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Masukkan alamat email yang valid!');
      return;
    }

    // 3. Validasi Panjang Sandi
    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter!');
      return;
    }

    // 4. Validasi Kecocokan Sandi
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak sesuai!');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Panggil backend API Express untuk reset password via email
      await resetPassword(email.trim().toLowerCase(), newPassword);

      Alert.alert(
        'Kata Sandi Diperbarui',
        'Kata sandi akun Anda berhasil direset. Silakan masuk kembali dengan kata sandi baru.',
        [
          {
            text: 'Masuk Sekarang',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal mereset kata sandi. Periksa email Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {/* Header Biru Atas */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="key-outline" size={30} color="#0284C7" />
            </View>
            <Text style={styles.headerTitle}>Atur Ulang Kata Sandi</Text>
            <Text style={styles.headerSubtitle}>
              Masukkan email akun Anda untuk membuat kata sandi baru
            </Text>
          </View>
        </SafeAreaView>

        {/* Form Card Putih Rounded */}
        <View style={styles.formCard}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Pesan Error */}
            {errorMsg ? (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 13, textAlign: 'center' }}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Email Terdaftar */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Akun Terdaftar</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                editable={!loading}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg('');
                }}
              />
            </View>

            {/* Kata Sandi Baru */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi Baru</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  editable={!loading}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>Minimal 6 karakter.</Text>
            </View>

            {/* Konfirmasi Kata Sandi Baru */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Ulangi kata sandi baru"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  editable={!loading}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Simpan */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Simpan Kata Sandi Baru</Text>
              )}
            </TouchableOpacity>

            {/* Footer Link Kembali ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Batal? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Kembali ke Masuk</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}