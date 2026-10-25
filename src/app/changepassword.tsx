// File: src/app/changepassword.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import {
  AUTH_VALIDATION_MESSAGES,
  EMAIL_REGEX,
  forgotPassword,
  resendOtp,
  resetPassword,
  STRONG_PASSWORD_REGEX,
} from '../services/user.service';
import { styles } from '../styles/change.styles';

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Langkah 1: Minta kode OTP reset password ke email (POST /users/forgot-password)
  const handleRequestOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg('Masukkan alamat email akun Anda.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg(AUTH_VALIDATION_MESSAGES.emailInvalid);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await forgotPassword(trimmedEmail);
      setInfoMsg(res.message || 'Jika email terdaftar, kode reset dikirim ke email.');
      setStep('reset');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Gagal mengirim kode reset.');
    } finally {
      setLoading(false);
    }
  };

  // Langkah 2: Verifikasi OTP & simpan password baru (POST /users/reset-password)
  const handleResetPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = otpCode.replace(/\D/g, '').trim();

    if (!trimmedCode || trimmedCode.length !== 6) {
      setErrorMsg('Masukkan 6 digit kode OTP yang dikirim ke email Anda.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Kata sandi baru dan konfirmasi wajib diisi.');
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

      const res = await resetPassword(trimmedEmail, trimmedCode, newPassword);

      Alert.alert(
        'Berhasil',
        res.message || 'Kata sandi berhasil diubah, silakan masuk.',
        [
          {
            text: 'Masuk Sekarang',
            onPress: () => router.replace('/login' as any),
          },
        ]
      );
    } catch (error: any) {
      setErrorMsg(error?.message || 'Kode verifikasi salah atau kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetOtp = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      setErrorMsg('');
      const res = await resendOtp(email.trim().toLowerCase(), 'reset');
      setInfoMsg(res.message || 'Kode baru dikirim.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Tunggu 1 menit sebelum meminta kode baru.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => (step === 'reset' ? setStep('request') : router.back())}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="key-outline" size={30} color="#0284C7" />
            </View>
            <Text style={styles.headerTitle}>Lupa Kata Sandi</Text>
            <Text style={styles.headerSubtitle}>
              {step === 'request'
                ? 'Masukkan email terdaftar untuk menerima kode OTP reset sandi'
                : `Masukkan 6 digit kode OTP yang dikirim ke ${email.trim()}`}
            </Text>
          </View>
        </SafeAreaView>

        <View style={styles.formCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {infoMsg ? (
              <View
                style={{
                  backgroundColor: '#EFF6FF',
                  borderColor: '#BFDBFE',
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}>
                <Text style={{ color: '#1E40AF', fontSize: 13, textAlign: 'center' }}>
                  {infoMsg}
                </Text>
              </View>
            ) : null}

            {/* Input Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Akun</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                editable={!loading && step === 'request'}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg('');
                }}
              />
            </View>

            {step === 'reset' ? (
              <>
                {/* Kode OTP 6 Digit */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Kode OTP (6 Digit dari Email)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { letterSpacing: 6, fontWeight: '700', textAlign: 'center', fontSize: 18 },
                    ]}
                    placeholder="123456"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otpCode}
                    editable={!loading}
                    onChangeText={(text) => {
                      setOtpCode(text.replace(/\D/g, ''));
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
                      placeholder="Min. 8 karakter (huruf + angka + simbol)"
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
                  <Text style={styles.infoText}>
                    Minimal 8 karakter & wajib kombinasi huruf, angka, dan simbol.
                  </Text>
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
              </>
            ) : null}

            {/* Tombol Utama */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={step === 'request' ? handleRequestOtp : handleResetPassword}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {step === 'request' ? 'Kirim Kode Reset' : 'Simpan Kata Sandi Baru'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Banner Error */}
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

            {/* Tombol Resend OTP pada tahap Reset */}
            {step === 'reset' ? (
              <View style={[styles.footer, { marginTop: 14 }]}>
                <Text style={styles.footerText}>Belum terima kode? </Text>
                <TouchableOpacity
                  onPress={handleResendResetOtp}
                  disabled={cooldown > 0 || resending}>
                  <Text
                    style={[
                      styles.linkText,
                      (cooldown > 0 || resending) && { color: '#94A3B8' },
                    ]}>
                    {resending
                      ? 'Mengirim...'
                      : cooldown > 0
                      ? `Kirim ulang (${cooldown}d)`
                      : 'Kirim Ulang Kode'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Footer Link ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Batal? </Text>
              <TouchableOpacity onPress={() => router.replace('/login' as any)}>
                <Text style={styles.linkText}>Kembali ke Masuk</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}