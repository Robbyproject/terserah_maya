// File: src/app/register.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedScreen } from '../components/animated-screen';
import { Colors } from '../constants/theme';
import {
  AUTH_VALIDATION_MESSAGES,
  EMAIL_REGEX,
  registerUser,
  STRONG_PASSWORD_REGEX,
  USERNAME_REGEX,
} from '../services/user.service';
import { styles } from '../styles/register.styles';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Validasi kolom kosong
    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }

    // 2. Validasi username (§1: 3-30 karakter, huruf/angka/underscore)
    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.usernameLength);
      return;
    }

    // 3. Validasi email (§1)
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.emailInvalid);
      return;
    }

    // 4. Validasi password (§1: min 8 karakter, huruf + angka + simbol)
    if (!STRONG_PASSWORD_REGEX.test(password)) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.passwordWeak);
      return;
    }

    // 5. Validasi konfirmasi password
    if (password !== confirmPassword) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.passwordMismatch);
      return;
    }

    // 6. Validasi persetujuan Syarat & Ketentuan
    if (!agreed) {
      setErrorMsg('Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // POST /users/register -> HTTP 202 (Kode OTP dikirim ke email, belum auto-login)
      const result = await registerUser(trimmedUsername, trimmedEmail, password);

      router.push({
        pathname: '/verify-otp' as any,
        params: {
          email: result.email || trimmedEmail,
          purpose: 'register',
          infoMessage: result.message,
        },
      });
    } catch (error: any) {
      setErrorMsg(error?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={30} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Buat Akun</Text>
            <Text style={styles.headerSubtitle}>Daftar untuk memulai layanan kami</Text>
          </View>
        </SafeAreaView>

        <View style={styles.formCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="doawahyudi (3–30 huruf/angka/_)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={username}
                editable={!loading}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMsg('');
                }}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@gmail.com"
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
              <Text style={styles.warningText}>
                ⓘ Kode verifikasi 6 digit akan dikirim ke email ini
              </Text>
            </View>

            {/* Kata Sandi */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 45 }]}
                  placeholder="Min. 8 karakter (huruf + angka + simbol)"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  editable={!loading}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, height: 40, justifyContent: 'center' }}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Konfirmasi Kata Sandi */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 45 }]}
                  placeholder="Ulangi kata sandi"
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
                  style={{ position: 'absolute', right: 12, height: 40, justifyContent: 'center' }}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setAgreed(!agreed);
                setErrorMsg('');
              }}
              activeOpacity={0.8}>
              <Ionicons
                name={agreed ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={agreed ? Colors.primary : Colors.textSecondary}
              />
              <Text style={styles.termsText}>
                Saya menyetujui <Text style={styles.linkText}>Syarat & Ketentuan</Text> serta{' '}
                <Text style={styles.linkText}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>

            {/* Tombol Buat Akun */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Buat Akun</Text>
              )}
            </TouchableOpacity>

            {/* Banner Error di bawah tombol */}
            {errorMsg ? (
              <View
                style={{
                  backgroundColor: '#FEE2E2',
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                }}>
                <Text style={{ color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Footer Link ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.signUpText}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}